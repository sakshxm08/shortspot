import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await api.getUserURLs();
        setUrls(response.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "An error occurred. Please try again."
        );
      }
    };
    fetchUrls();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Your Shortened URLs</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul className="space-y-4">
        {urls.map((url) => (
          <li key={url._id} className="border-b pb-2">
            <p>
              Original:{" "}
              <Link
                to={url.originalUrl}
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                {url.originalUrl}
              </Link>
            </p>
            <p>
              Shortened:{" "}
              <Link
                to={`${import.meta.env.VITE_SHORTEN_BASE_URL}/${url.shortUrl}`}
                target="_blank"
                className="text-blue-500 hover:underline"
              >{`${import.meta.env.VITE_SHORTEN_BASE_URL}/${
                url.shortUrl
              }`}</Link>
            </p>
            <p className="text-sm text-gray-500">
              Created: {new Date(url.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
