import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Router";
import { AuthProvider, useAuth } from "./AuthContext";
import { NotificationProvider } from "./NotificationContext";

/**
 * PUBLIC_INTERFACE
 * Navigation bar with accessible layout, current user info, dark mode, and links.
 */
function Navbar({ theme, toggleTheme }) {
  const { user, token, logout } = useAuth();
  return (
    <nav
      className="navbar"
      aria-label="Main Navigation"
      style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-color)",
        display: "flex",
        padding: "0.5em 2em",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "1.3em" }} aria-label="Home">
        To-Do List
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        {token && (
          <>
            <a href="/dashboard" className="App-link">
              Dashboard
            </a>
            <a href="/profile" className="App-link">
              Profile
            </a>
            <button
              onClick={logout}
              className="App-link"
              aria-label="Logout"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
                fontWeight: 600,
                fontSize: "1em",
              }}
            >
              Logout
            </button>
            <div
              style={{
                marginLeft: "1.5em",
                color: "var(--text-secondary)",
                fontWeight: 500,
              }}
              aria-label="Logged in user"
            >
              {user && (user.username || user.email)}
            </div>
          </>
        )}
        {!token && (
          <>
            <a href="/login" className="App-link">
              Login
            </a>
            <a href="/register" className="App-link">
              Register
            </a>
          </>
        )}
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    // Set aria-live region at root for dynamic feedback
    document.body.setAttribute("aria-live", "polite");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <div className="App">
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <main
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "2em 0",
                minHeight: "75vh",
              }}
              aria-label="Content"
            >
              <AppRoutes />
            </main>
            <footer
              style={{
                fontSize: "0.95em",
                color: "var(--text-secondary)",
                textAlign: "center",
                margin: "2em 0",
              }}
              aria-label="Footer"
            >
              &copy; {new Date().getFullYear()} To-Do List
            </footer>
          </div>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
