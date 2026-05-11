import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  updateProfile,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

import { auth } from "../config/firebase";
import AuthLayout from "../components/AuthLayout";
import "../styles/auth.css";

function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await setPersistence(auth, browserSessionPersistence);

      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (username.trim()) {
        await updateProfile(credential.user, {
          displayName: username.trim(),
        });
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      formTitle="Create account"
      formSubtitle="Sign up with username, email and password."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSignup}>
        <Form.Group className="mb-3">
          <Form.Label className="auth-label">Username</Form.Label>
          <Form.Control
            className="auth-input"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </Form>
    </AuthLayout>
  );
}

export default Signup;