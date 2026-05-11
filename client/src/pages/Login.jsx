import { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

import { auth } from "../config/firebase";
import api from "../services/api";
import AuthLayout from "../components/AuthLayout";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Checking backend status...");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await api.get("/api/health");
        setStatus("Backend connected.");
      } catch {
        setStatus("Backend unavailable right now.");
      }
    };

    checkBackend();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      formTitle="Sign in"
      formSubtitle="Use your email and password to continue."
      statusText={status}
      footer={
        <>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label className="auth-label">Email</Form.Label>
          <Form.Control
            className="auth-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="auth-label">Password</Form.Label>
          <Form.Control
            className="auth-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </Form>
    </AuthLayout>
  );
}

export default Login;