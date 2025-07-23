import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNotification } from "../NotificationContext";

/**
 * PUBLIC_INTERFACE
 * ProfilePage - User profile view and update with accessible, live error feedback.
 */
export default function ProfilePage() {
  const { user, updateProfile, loading, error, setError } = useAuth();
  const { notify } = useNotification();
  const [fields, setFields] = useState(() => ({
    username: user?.username || "",
    email: user?.email || "",
  }));
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setFields({ ...fields, [e.target.name]: e.target.value });
    if (error) setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateProfile(fields);
      notify("Profile updated!");
    } catch (err) {
      notify("Profile update failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section aria-label="Profile section" style={{ width: "100%", maxWidth: 400 }}>
      <h1 tabIndex={0}>My Profile</h1>
      <form onSubmit={handleSubmit} aria-describedby="profile-description">
        <div id="profile-description" style={{ color: "var(--text-secondary)" }}>
          Manage your profile information.
        </div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          disabled // username not editable (or make editable if backend supports)
          value={fields.username}
          onChange={handleChange}
          style={{ width: "100%", padding: "0.5em" }}
        />
        <label htmlFor="email" style={{ marginTop: 10 }}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={fields.email}
          required
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
          {submitting ? "Saving..." : "Save"}
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
    </section>
  );
}
