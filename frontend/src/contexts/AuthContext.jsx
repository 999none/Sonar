import { createContext, useContext, useState, useEffect, useCallback } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("sonar-token"));
  const [loading, setLoading] = useState(true);

  // Restore session from stored token
  useEffect(() => {
    if (token) {
      fetchMe(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMe = async (jwt) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setToken(jwt);
      } else {
        // Token invalid/expired
        localStorage.removeItem("sonar-token");
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      localStorage.removeItem("sonar-token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Registration failed");
    localStorage.setItem("sonar-token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const login = async (email, password) => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Login failed");
    localStorage.setItem("sonar-token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = useCallback(() => {
    localStorage.removeItem("sonar-token");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;