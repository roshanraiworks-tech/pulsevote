import { Router } from "express";
import {
    createPoll,
    getPollByCode,
    submitVote,
    checkUserVoteStatus,
    getPollsByCreator,
} from "../controllers/pollController.js";

const router = Router();

router.post("/", createPoll);
router.get("/creator/:userId", getPollsByCreator);
router.get("/:pollCode", getPollByCode);
router.post("/:pollCode/vote", submitVote);
router.get("/:pollCode/vote-status/:userId", checkUserVoteStatus);

export default router;