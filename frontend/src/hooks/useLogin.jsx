import { useState } from "react";
import { useUser } from "./useUser";
import api, { setAuthToken } from "../api";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUser, setToken } = useUser();

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.login(credentials);
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setAuthToken(response.data.token); // Add this line
      return response.data;
    } catch (err) {
      console.log(err);
      const errorMessage = err.response?.data?.error || "An error occurred";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
