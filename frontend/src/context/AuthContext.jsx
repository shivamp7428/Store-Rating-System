import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, signup as signupApi } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        clearSession();
      }
    }

    setLoading(false);
  }, []);

  const authenticate = (apiCall) => async (payload) => {
    const data = await apiCall(payload);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const login = authenticate(loginApi);
  const signup = authenticate(signupApi);

  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && user);

  return <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}