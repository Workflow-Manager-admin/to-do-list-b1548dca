import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNotification } from "../NotificationContext";
import { useNavigate } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * LoginPage - login form with a11y, error notifications, focus.
 */
export default function LoginPage() {
  const { login, loading, error, setError } = useAuth();
  const { notify } = useNotification();
  const [fields, setFields] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();

  function handleChange(e) {
    setFields({ ...fields, [e.target.name]: e.target.value });
    if (error) setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(fields.username, fields.password);
      notify("Login successful!");
      nav("/dashboard");
    } catch (err) {
      notify("Login failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section aria-label="Login section" style={{ width: "100%", maxWidth: 360 }}>
      <h1 tabIndex={0}>Login</h1>
      <form onSubmit={handleSubmit} aria-describedby="login-description">
        <div id="login-description" style={{ color: "var(--text-secondary)" }}>
          Enter your credentials to sign in.
        </div>
        <label htmlFor="username">Username or Email</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoFocus
          required
          value={fields.username}
          onChange={handleChange}
          style={{ width: "100%", padding: "0.5em" }}
        />
        <label htmlFor="password" style={{ marginTop: 12 }}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={fields.password}
          onChange={handleChange}
          style={{ width: "100%", padding: "0.5em" }}
        />
        <button
          className="btn"
          type="submit"
          disabled={loading || submitting}
          aria-busy={loading ? "true" : "false"}
          style={{ marginTop: 16, width: "100%" }}
        >
          {submitting ? "Logging in..." : "Login"}
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
        <a href="/register" className="App-link">
          Don&apos;t have an account? Register
        </a>
      </div>
    </section>
  );
}
