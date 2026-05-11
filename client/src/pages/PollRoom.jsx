import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Card,
  Spinner,
  Alert,
  Button,
  Badge,
} from "react-bootstrap";
import api from "../services/api";
import socket from "../sockets/socket";
import { useAuth } from "../hooks/useAuth";
import PollResultsBars from "../components/PollResultsBars";
import "../styles/app.css";

function PollRoom() {
  const { pollCode } = useParams();
  const { user } = useAuth();

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/api/polls/${pollCode}`);
        const pollData = response.data.data;

        setPoll(pollData);

        if (user) {
          const voteStatusResponse = await api.get(
            `/api/polls/${pollCode}/vote-status/${user.uid}`
          );
          setHasVoted(voteStatusResponse.data.hasVoted);
        }

        socket.connect();
        socket.off("poll_updated");
        socket.off("connect");

        const joinRoom = () => {
          socket.emit("join_poll", pollData.pollCode);
        };

        socket.on("connect", joinRoom);
        joinRoom();

        socket.on("poll_updated", (updatedPoll) => {
          setPoll((prev) => ({
            ...prev,
            ...updatedPoll,
          }));
        });
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load poll.");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();

    return () => {
      socket.emit("leave_poll", pollCode);
      socket.off("poll_updated");
      socket.off("connect");
      socket.disconnect();
    };
  }, [pollCode, user]);

  useEffect(() => {
    if (!poll?.endTime) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((poll.endTime - Date.now()) / 1000)
      );

      setTimeLeft(remaining);

      if (remaining <= 0) {
        setPoll((prev) => ({
          ...prev,
          status: "closed",
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [poll]);

  const handleVote = async (optionIndex) => {
    try {
      if (!user) {
        setError("Please login before voting.");
        return;
      }

      setVoting(true);
      setError("");

      const response = await api.post(`/api/polls/${pollCode}/vote`, {
        optionIndex,
        userId: user.uid,
      });

      setPoll(response.data.data);
      setHasVoted(true);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to submit vote.");
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const pollEnded = poll.status === "closed" || timeLeft <= 0;

  return (
    <div className="pv-page-shell">
      <Container>
        <Card className="pv-page-card">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
            <div>
              <div className="pv-section-label">Poll room</div>
              <h1 className="pv-page-title mb-2">{poll.question}</h1>
              <div className="d-flex flex-wrap gap-2">
                <Badge bg={pollEnded ? "danger" : "success"} className="pv-status-badge">
                  {pollEnded ? "Closed" : "Live"}
                </Badge>
                <Badge bg="secondary" className="pv-status-badge">
                  Code: {poll.pollCode}
                </Badge>
              </div>
            </div>

            <div className="pv-summary-card">
              <span>Time Left</span>
              <strong>{timeLeft}s</strong>
            </div>
          </div>

          <div className="pv-summary-row mb-4">
            <div className="pv-summary-card">
              <span>Total Votes</span>
              <strong>{poll.totalVotes || 0}</strong>
            </div>
            <div className="pv-summary-card">
              <span>Your Vote</span>
              <strong>{hasVoted ? "Submitted" : "Pending"}</strong>
            </div>
            <div className="pv-summary-card">
              <span>Status</span>
              <strong>{pollEnded ? "Ended" : "Active"}</strong>
            </div>
          </div>

          {!hasVoted && !pollEnded ? (
            <div className="pv-vote-grid">
              {poll.options.map((option, index) => (
                <Button
                  key={index}
                  className="pv-vote-button"
                  disabled={voting}
                  onClick={() => handleVote(index)}
                >
                  {option.text}
                </Button>
              ))}
            </div>
          ) : (
            <div>
              {hasVoted && <Alert variant="success">Vote submitted successfully.</Alert>}
              {pollEnded && <Alert variant="warning">Poll has ended.</Alert>}

              <PollResultsBars poll={poll} />
            </div>
          )}
        </Card>
      </Container>
    </div>
  );
}

export default PollRoom;