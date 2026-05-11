import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function AppNavbar() {
  const { user, logout } = useAuth();
  const userLabel = user?.displayName || user?.email;

  return (
    <Navbar expand="lg" className="pv-navbar px-2 px-md-0">
      <Container>
        <Navbar.Brand as={Link} to="/" className="pv-brand">
          <span className="pv-brand-dot" />
          <span>PulseVote</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="pv-nav" className="pv-toggle" />

        <Navbar.Collapse id="pv-nav">
          <Nav className="ms-auto align-items-lg-center gap-2 gap-lg-3">
            <Nav.Link as={Link} to="/" className="pv-nav-link">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/my-polls" className="pv-nav-link">
              My Polls
            </Nav.Link>
            <Nav.Link as={Link} to="/create" className="pv-nav-link">
              Create Poll
            </Nav.Link>
            <Nav.Link as={Link} to="/join" className="pv-nav-link">
              Join Poll
            </Nav.Link>
            <Nav.Link as={Link} to="/results" className="pv-nav-link">
              Live Results
            </Nav.Link>

            {user ? (
              <>
                <div className="pv-user-pill">{userLabel}</div>
                <Button
                  variant="outline-light"
                  size="sm"
                  className="pv-logout"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;