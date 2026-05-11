import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import "../styles/app.css";

function JoinPoll() {
  const [pollCode, setPollCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!pollCode.trim()) {
      setError("Please enter a poll code.");
      return;
    }

    navigate(`/poll/${pollCode.toUpperCase()}`);
  };

  return (
    <div className="pv-page-shell">
      <Container>
        <div className="pv-page-top">
          <div>
            <div className="pv-section-label">Join</div>
            <h1 className="pv-page-title">Join a poll</h1>
            <p className="pv-page-copy">
              Enter the poll code shared by the creator and join the live session instantly.
            </p>
          </div>
        </div>

        <Row className="g-4">
          <Col lg={6}>
            <Card className="pv-page-card">
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="pv-form-label">Poll Code</Form.Label>
                  <Form.Control
                    className="pv-soft-input"
                    type="text"
                    placeholder="Example: KRQ7OU"
                    value={pollCode}
                    onChange={(e) => setPollCode(e.target.value.toUpperCase())}
                  />
                </Form.Group>

                <div className="d-flex flex-wrap gap-2">
                  <Button type="submit" className="pv-gradient-btn">
                    Join Poll
                  </Button>
                  <Button as={Link} to="/my-polls" variant="outline-light" className="pv-pill-btn">
                    My Polls
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="pv-page-card pv-side-card">
              <div className="pv-side-title">How it works</div>
              <div className="pv-side-copy">
                Ask the creator for the code, open the poll room, and vote with live sync.
              </div>

              <div className="pv-side-stack mt-3">
                <div className="pv-info-tile">
                  <strong>Realtime sync</strong>
                  <p>Results update instantly across connected devices.</p>
                </div>
                <div className="pv-info-tile">
                  <strong>Secure login</strong>
                  <p>Only authenticated users can participate.</p>
                </div>
                <div className="pv-info-tile">
                  <strong>Fast access</strong>
                  <p>Join any live poll with a single code.</p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default JoinPoll;