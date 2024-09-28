import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../api";

export const URLContext = createContext();

export const URLProvider = ({ children }) => {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const fetchUrls = async () => {
    try {
      const response = await api.getUserURLs();
      setUrls(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUrls();
  }, [setUrls]);

  return (
    <URLContext.Provider
      value={{ urls, setUrls, error, loading, setLoading, setError, fetchUrls }}
    >
      {children}
    </URLContext.Provider>
  );
};
URLProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
