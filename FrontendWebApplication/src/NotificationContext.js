import React, { createContext, useContext, useState, useCallback, useRef } from "react";

const NotificationContext = createContext();

/**
 * PUBLIC_INTERFACE
 * Hook to access notification system.
 */
export function useNotification() {
  return useContext(NotificationContext);
}

/**
 * PUBLIC_INTERFACE
 * NotificationProvider provides real-time, accessible notification system via context.
 */
export function NotificationProvider({ children }) {
  const [message, setMessage] = useState(null);
  const timeoutRef = useRef(null);

  // PUBLIC_INTERFACE
  const notify = useCallback((msg, timeout = 4000) => {
    setMessage(msg);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMessage(null), timeout);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {/* ARIA live region for accessibility */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        style={{
          position: "fixed",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          minWidth: 200,
          zIndex: 9999,
          background: "#222",
          color: "#fff",
          borderRadius: 5,
          padding: "0.75em 1.5em",
          opacity: message ? 0.97 : 0,
          pointerEvents: "none",
          fontSize: "1.1em",
          transition: "opacity 0.2s",
        }}
        role="status"
      >
        {message}
      </div>
    </NotificationContext.Provider>
  );
}
