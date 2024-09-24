import { createContext, useState, useEffect, useCallback } from "react";
import api, { setAuthToken } from "../api";
import PropTypes from "prop-types";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    setGlobalLoading(true);
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        setAuthToken(storedToken);
        const response = await api.getCurrentUser("/me");
        setUser(response.data.user);
        setToken(storedToken);
      } catch (error) {
        console.error("Authentication failed:", error);
        localStorage.removeItem("token");
        setAuthToken(null);
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false);
    setGlobalLoading(false);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const value = {
    user,
    setUser,
    token,
    setToken,
    loading,
    globalLoading,
    setGlobalLoading,
    checkAuthStatus,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
