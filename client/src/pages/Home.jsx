import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/app.css";

function Home() {
  const { user } = useAuth();

  // const displayName = user?.displayName || user?.email || "Creator";
  const displayName =
  user?.displayName || user?.email?.split("@")[0] || "Creator";

  return (
    <div className="pv-home-shell">
      <Container>
        <section className="pv-hero">
          <div className="pv-chip">Protected realtime workspace</div>

          <h1 className="pv-hero-title">
            Welcome back, {displayName}. Manage polls with a clean, modern realtime dashboard.
          </h1>

          <p className="pv-hero-copy">
            Create live polls, invite participants with a code, and watch votes
            sync instantly across every connected screen.
          </p>

          <div className="pv-action-row">
            <Button as={Link} to="/create" className="pv-action-btn" variant="primary">
              Create Poll
            </Button>
            <Button as={Link} to="/my-polls" className="pv-action-btn" variant="outline-light">
              My Polls
            </Button>
            <Button as={Link} to="/join" className="pv-action-btn" variant="outline-light">
              Join Poll
            </Button>
            <Button as={Link} to="/results" className="pv-action-btn" variant="outline-info">
              Live Results
            </Button>
          </div>

          <div className="pv-panel">
            <div className="pv-mini-card">
              <h3>Realtime voting</h3>
              <p>Polls update instantly when any participant submits a vote.</p>
            </div>

            <div className="pv-mini-card">
              <h3>Creator dashboard</h3>
              <p>See all your polls and live status without entering poll IDs.</p>
            </div>

            <div className="pv-mini-card">
              <h3>Premium UI</h3>
              <p>Dark glassmorphism design with a modern SaaS-style finish.</p>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

export default Home;