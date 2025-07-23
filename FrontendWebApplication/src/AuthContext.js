import React, { createContext, useState, useContext, useEffect } from "react";
import * as api from "./api";

const AuthContext = createContext();

/**
 * PUBLIC_INTERFACE
 * useAuth hook to access authentication state and helpers
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider: Wrap entire app to provide login/profile state and helpers.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState(null);

  // On mount or login, fetch profile if token
  useEffect(() => {
    let mounted = true;
    if (token) {
      setLoading(true);
      api
        .getProfile(token)
        .then((u) => mounted && setUser(u))
        .catch((e) => {
          logout();
        })
        .finally(() => mounted && setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line
  }, [token]);

  function saveToken(t) {
    setToken(t);
    if (t) {
      localStorage.setItem("token", t);
    } else {
      localStorage.removeItem("token");
    }
  }

  // PUBLIC_INTERFACE
  async function loginFn(username, password) {
    setLoading(true);
    setError(null);
    try {
      const data = await api.login({ username, password });
      if (data.token) {
        saveToken(data.token);
        const u = await api.getProfile(data.token);
        setUser(u);
      } else {
        throw new Error("Invalid token");
      }
    } catch (e) {
      setError(e.message || "Login failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  function logout() {
    saveToken(null);
    setUser(null);
    setError(null);
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  async function registerFn(regInfo) {
    setLoading(true);
    setError(null);
    try {
      const data = await api.register(regInfo);
      return data;
    } catch (e) {
      setError(e.message || "Registration failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function updateProfileFn(profile) {
    setLoading(true);
    setError(null);
    try {
      const upd = await api.updateProfile(token, profile);
      setUser(upd);
      return upd;
    } catch (e) {
      setError(e.message || "Profile update failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login: loginFn,
        logout,
        register: registerFn,
        updateProfile: updateProfileFn,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
