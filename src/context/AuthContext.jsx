import React, { createContext, useContext, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("combopoint_token") || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("combopoint_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username, password) => {
    const res = await API.post("/admin/login", { username, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem("combopoint_token", res.data.token);
      localStorage.setItem("combopoint_user", JSON.stringify(res.data.user));
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("combopoint_token");
    localStorage.removeItem("combopoint_user");
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
