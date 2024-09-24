import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../api";
import URLCard from "../components/URLCard";
import { useURLs } from "../hooks/useURLs";

const MyURLs = () => {
  const { urls, setUrls } = useURLs();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchUrls();
  }, [setUrls]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto mt-10 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Your Shortened URLs</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {urls.map((url) => (
          <URLCard key={url._id} url={url} />
        ))}
      </ul>
    </motion.div>
  );
};

export default MyURLs;
