import { io } from "../server.js";
import { db, FieldValue } from "../config/firebase.js";
// import { FieldValue } from "firebase-admin/firestore";
// import { db } from "../config/firebase.js";

const pollsCollection = db.collection("polls");

function isPollExpired(poll) {
    const endTime = Number(poll?.endTime || 0);
    return poll?.status !== "closed" && endTime > 0 && Date.now() >= endTime;
}


function generatePollCode(length = 6) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < length; i++) {
        code += characters[Math.floor(Math.random() * characters.length)];
    }

    return code;
}

async function generateUniquePollCode() {
    let isUnique = false;
    let pollCode = "";

    while (!isUnique) {
        pollCode = generatePollCode();

        const existingPoll = await pollsCollection
            .where("pollCode", "==", pollCode)
            .limit(1)
            .get();

        if (existingPoll.empty) {
            isUnique = true;
        }
    }

    return pollCode;
}

export async function createPoll(req, res) {
    try {
        const {
            question,
            timer,
            options,
            creatorId,
            creatorEmail = "",
            creatorName = "",
        } = req.body;

        if (!creatorId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required to create a poll.",
            });
        }

        const pollQuestion =
            typeof question === "string" ? question.trim() : "";

        const pollTimer = Number(timer);

        const cleanedOptions = Array.isArray(options)
            ? options
                .map((option) => String(option).trim())
                .filter(Boolean)
            : [];

        if (!pollQuestion) {
            return res.status(400).json({
                success: false,
                message: "Poll question is required.",
            });
        }

        if (!Number.isInteger(pollTimer) || pollTimer < 5) {
            return res.status(400).json({
                success: false,
                message: "Timer must be an integer of at least 5 seconds.",
            });
        }

        if (cleanedOptions.length < 2) {
            return res.status(400).json({
                success: false,
                message: "At least 2 valid options are required.",
            });
        }

        const pollCode = await generateUniquePollCode();
        const pollRef = pollsCollection.doc();

        const pollData = {
            pollId: pollRef.id,
            pollCode,
            question: pollQuestion,
            timer: pollTimer,
            endTime: Date.now() + pollTimer * 1000,
            options: cleanedOptions.map((text) => ({
                text,
                votes: 0,
            })),
            totalVotes: 0,
            status: "active",
            createdBy: creatorId,
            creatorEmail,
            creatorName,
            voters: [],
            createdAt: FieldValue.serverTimestamp(),
        };

        await pollRef.set(pollData);

        return res.status(201).json({
            success: true,
            message: "Poll created successfully.",
            data: {
                pollId: pollRef.id,
                pollCode,
            },
        });
    } catch (error) {
        console.error("Create poll error:", error);

        return res.status(500).json({
            success: false,
            message:
                process.env.NODE_ENV === "production"
                    ? "Failed to create poll."
                    : error.message || "Failed to create poll.",
        });
    }
}

export async function getPollsByCreator(req, res) {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required.",
            });
        }

        const snapshot = await pollsCollection
            .where("createdBy", "==", userId)
            .get();

        const polls = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const poll = doc.data();

                if (isPollExpired(poll)) {
                    await doc.ref.update({ status: "closed" });
                    return {
                        ...poll,
                        status: "closed",
                    };
                }

                return poll;
            })
        );

        return res.status(200).json({
            success: true,
            data: polls,
        });
    } catch (error) {
        console.error("Get polls by creator error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch creator polls.",
        });
    }
}

export async function getPollByCode(req, res) {
    try {
        const { pollCode } = req.params;

        const snapshot = await pollsCollection
            .where("pollCode", "==", pollCode.toUpperCase())
            .limit(1)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({
                success: false,
                message: "Poll not found.",
            });
        }

        const doc = snapshot.docs[0];
        const poll = doc.data();

        if (isPollExpired(poll)) {
            await doc.ref.update({ status: "closed" });
            return res.status(200).json({
                success: true,
                data: {
                    ...poll,
                    status: "closed",
                },
            });
        }

        return res.status(200).json({
            success: true,
            data: poll,
        });
    } catch (error) {
        console.error("Get poll error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch poll.",
        });
    }
}

export async function submitVote(req, res) {
    try {
        const { pollCode } = req.params;

        const { optionIndex , userId } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "Authentication required.",
            });
        }

        if (optionIndex === undefined) {
            return res.status(400).json({
                success: false,
                message: "Option index is required.",
            });
        }

        const snapshot = await pollsCollection
            .where("pollCode", "==", pollCode.toUpperCase())
            .limit(1)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({
                success: false,
                message: "Poll not found.",
            });
        }

        const doc = snapshot.docs[0];

        const poll = doc.data();

        const currentTime = Date.now();

        if (isPollExpired(poll)) {
            await doc.ref.update({ status: "closed" });

            return res.status(400).json({
                success: false,
                message: "Poll has ended.",
            });
        }

        // if (
        //     poll.status !== "active" ||
        //     currentTime >= poll.endTime
        // ) {
        //     await doc.ref.update({
        //         status: "closed",
        //     });

        //     return res.status(400).json({
        //         success: false,
        //         message: "Poll has ended.",
        //     });
        // }

        // if (poll.status !== "active") {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Poll is no longer active.",
        //     });
        // }

        const voters = poll.voters || [];

        if (voters.includes(userId)) {
            return res.status(400).json({
                success: false,
                message:
                    "You have already voted in this poll.",
            });
        }

        const updatedOptions = [...poll.options];

        if (!updatedOptions[optionIndex]) {
            return res.status(400).json({
                success: false,
                message: "Invalid option selected.",
            });
        }

        updatedOptions[optionIndex].votes += 1;
        voters.push(userId);

        const updatedTotalVotes = (poll.totalVotes || 0) + 1;

        await doc.ref.update({
            options: updatedOptions,
            totalVotes: updatedTotalVotes,
            voters
        });

        const updatedPoll = {
            ...poll,
            options: updatedOptions,
            totalVotes: updatedTotalVotes,
        };

        io.to(poll.pollCode).emit(
            "poll_updated",
            updatedPoll
        );

        return res.status(200).json({
            success: true,
            message: "Vote submitted successfully.",
            data: updatedPoll,
        });
    } catch (error) {
        console.error("Submit vote error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to submit vote.",
        });
    }
}

export async function checkUserVoteStatus(
    req,
    res
) {
    try {
        const { pollCode, userId } =
            req.params;

        const snapshot =
            await pollsCollection
                .where(
                    "pollCode",
                    "==",
                    pollCode.toUpperCase()
                )
                .limit(1)
                .get();

        if (snapshot.empty) {
            return res.status(404).json({
                success: false,
                message: "Poll not found.",
            });
        }

        const poll =
            snapshot.docs[0].data();

        const voters =
            poll.voters || [];

        const hasVoted =
            voters.includes(userId);

        return res.status(200).json({
            success: true,
            hasVoted,
        });
    } catch (error) {
        console.error(
            "Check vote status error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to check vote status.",
        });
    }
}