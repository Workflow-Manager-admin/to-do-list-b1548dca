import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNotification } from "../NotificationContext";
import { useNavigate } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * RegisterPage - registration form with a11y, live error, and redirect to login on success.
 */
export default function RegisterPage() {
  const { register, loading, error, setError } = useAuth();
  const { notify } = useNotification();
  const nav = useNavigate();
  const [fields, setFields] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setFields({ ...fields, [e.target.name]: e.target.value });
    if (error) setError(null);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (fields.password !== fields.confirm) {
      setError("Passwords do not match");
      return;
    }
    setSubmitting(true);
    try {
      await register({
        username: fields.username,
        email: fields.email,
        password: fields.password,
      });
      notify("Registration successful! Please login.");
      nav("/login");
    } catch (err) {
      notify("Registration failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section aria-label="Register section" style={{ width: "100%", maxWidth: 400 }}>
      <h1 tabIndex={0}>Register</h1>
      <form onSubmit={handleSubmit} aria-describedby="register-description">
        <div id="register-description" style={{ color: "var(--text-secondary)" }}>
          Create a new account.
        </div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          required
          value={fields.username}
          onChange={handleChange}
          autoComplete="username"
          autoFocus
          style={{ width: "100%", padding: "0.5em" }}
        />
        <label htmlFor="email" style={{ marginTop: 10 }}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={fields.email}
          onChange={handleChange}
          autoComplete="email"
          style={{ width: "100%", padding: "0.5em" }}
        />
        <label htmlFor="password" style={{ marginTop: 10 }}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={fields.password}
          onChange={handleChange}
          autoComplete="new-password"
          style={{ width: "100%", padding: "0.5em" }}
        />
        <label htmlFor="confirm" style={{ marginTop: 10 }}>
          Confirm Password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          value={fields.confirm}
          onChange={handleChange}
          autoComplete="new-password"
          style={{ width: "100%", padding: "0.5em" }}
        />
        <button
          className="btn"
          type="submit"
          disabled={loading || submitting}
          aria-busy={loading ? "true" : "false"}
          style={{ marginTop: 16, width: "100%" }}
        >
          {submitting ? "Registering..." : "Register"}
        </button>
        {error && (
          <div
            aria-live="assertive"
            style={{ marginTop: 12, color: "#b22", fontWeight: 500 }}
          >
            {error}
          </div>
        )}
      </form>
      <div style={{ marginTop: 10 }}>
        <a href="/login" className="App-link">
          Already have an account? Login
        </a>
      </div>
    </section>
  );
}
