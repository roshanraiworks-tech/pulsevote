import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import api from "../services/api";
import socket from "../sockets/socket";
// import PollResultsBars from "../components/PollResultsBars";
import "../styles/app.css";
import PollResultsChart from "../components/PollResultsChart";

function LiveResults() {
  const [pollCode, setPollCode] = useState("");
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoadPoll = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/api/polls/${pollCode}`);
      const pollData = response.data.data;

      setPoll(pollData);

      socket.connect();
      socket.off("poll_updated");
      socket.emit("join_poll", pollData.pollCode);

      socket.on("poll_updated", (updatedPoll) => {
        setPoll((prev) => ({
          ...prev,
          ...updatedPoll,
        }));
      });
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      socket.off("poll_updated");
      socket.disconnect();
    };
  }, []);

  return (
    <div className="pv-page-shell">
      <Container>
        <div className="pv-page-top">
          <div>
            <div className="pv-section-label">Live Results</div>
            <h1 className="pv-page-title">Track poll results in real time</h1>
            <p className="pv-page-copy">
              Enter a poll code to load smooth, live-updating statistics.
            </p>
          </div>
        </div>

        <Card className="pv-page-card mb-4">
          <Form onSubmit={handleLoadPoll} className="d-flex flex-column gap-3">
            <Form.Group>
              <Form.Label className="pv-form-label">Enter Poll Code</Form.Label>
              <Form.Control
                className="pv-soft-input"
                type="text"
                placeholder="Example: KRQ7OU"
                value={pollCode}
                onChange={(e) => setPollCode(e.target.value.toUpperCase())}
              />
            </Form.Group>

            <div className="d-flex flex-wrap gap-2">
              <Button type="submit" className="pv-gradient-btn" disabled={loading}>
                {loading ? "Loading..." : "Load Results"}
              </Button>
            </div>
          </Form>
        </Card>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        )}

        {!poll && !loading && !error && (
          <Card className="pv-page-card pv-empty-state">
            Enter a poll code to view live results.
          </Card>
        )}

        {poll && (
          <Card className="pv-page-card">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
              <div>
                <div className="pv-side-title mb-2">{poll.question}</div>
                <div className="pv-small-muted">Poll Code: {poll.pollCode}</div>
              </div>

              <Badge bg={poll.status === "closed" ? "danger" : "success"} className="pv-status-badge">
                {poll.status === "closed" ? "Closed" : "Live"}
              </Badge>
            </div>

            <div className="pv-summary-row">
              <div className="pv-summary-card">
                <span>Total Votes</span>
                <strong>{poll.totalVotes || 0}</strong>
              </div>
              <div className="pv-summary-card">
                <span>Timer</span>
                <strong>{poll.timer}s</strong>
              </div>
              <div className="pv-summary-card">
                <span>Mode</span>
                <strong>Realtime</strong>
              </div>
            </div>

            <PollResultsChart poll={poll} /> 
          </Card>
        )}
      </Container>
    </div>
  );
}

export default LiveResults;