import { useState } from "react";
import { motion } from "framer-motion";
import api from "../api";
import { Link } from "react-router-dom";
import Menu from "../components/Menu";
import { useURLs } from "../hooks/useURLs";

const URLShortener = () => {
  const [inputURL, setInputURL] = useState("");
  const [customURL, setCustomURL] = useState("");
  const [useCustomURL, setUseCustomURL] = useState(false);
  const [shortenedURL, setShortenedURL] = useState("");
  const [responseURL, setResponseURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [protocol, setProtocol] = useState("https");
  const [socialPlatform, setSocialPlatform] = useState("Twitter");
  const [socialLink, setSocialLink] = useState("");

  const { setUrls } = useURLs();
  const isValidURL = (url) => {
    // Regular expression to match valid domain names
    const domainRegex = /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;

    // Split the URL into domain and path
    const [domain, ...pathParts] = url.split("/");

    // Check if the domain is valid
    if (!domainRegex.test(domain)) {
      return false;
    }

    // If there's a path, make sure it's valid
    if (pathParts.length > 0) {
      const path = "/" + pathParts.join("/");
      try {
        new URL(`http://${domain}${path}`);
      } catch (error) {
        console.error("Error parsing URL:", error);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (useCustomURL && customURL.includes("/")) {
      setShortenedURL("");
      setError("Custom URL cannot contain slashes");
      setIsLoading(false);
      return;
    }

    if (inputURL.startsWith("http:") || inputURL.startsWith("https:")) {
      setShortenedURL("");
      setError(
        "Please remove the protocol from the URL and select it from the dropdown."
      );
      setIsLoading(false);
      return;
    }

    if (!isValidURL(inputURL)) {
      setShortenedURL("");
      setError("Please enter a valid URL.");
      setIsLoading(false);
      return;
    }

    let fullURL = `${protocol}://${inputURL}`;

    try {
      const response = await api.shortenURL({
        originalUrl: fullURL,
        customUrl: customURL,
        useCustomUrl: useCustomURL,
      });
      setResponseURL(response.data);
      setUrls((prevUrls) => [response.data, ...prevUrls]);
      setShortenedURL(
        import.meta.env.VITE_SHORTEN_BASE_URL + "/" + response.data.shortUrl
      );
    } catch (err) {
      setShortenedURL("");
      setError(err.response?.data?.error || "Failed to shorten URL");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSocial = async (e) => {
    e.preventDefault();
    try {
      const response = await api.shortenURL({
        originalUrl: socialLink,
        platform: socialPlatform.toLowerCase(),
      });
      setResponseURL(response.data);
      setUrls((prevUrls) => [response.data, ...prevUrls]);
      setShortenedURL(
        import.meta.env.VITE_SHORTEN_BASE_URL + "/" + response.data.shortUrl
      );
    } catch (err) {
      setShortenedURL("");
      setError(err.response?.data?.error || "Failed to shorten URL");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-screen-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">URL Shortener</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex">
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                className="px-2 py-2 border border-gray-300 bg-gray-300 text-gray-600 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="http">http://</option>
                <option value="https">https://</option>
              </select>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={inputURL}
                onChange={(e) => setInputURL(e.target.value)}
                placeholder="Enter URL to shorten"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useCustomURL"
                className="mr-2 accent-primary-500"
                checked={useCustomURL}
                onChange={(e) => setUseCustomURL(e.target.checked)}
              />
              <label htmlFor="useCustomURL">Use custom URL</label>
            </div>
            {useCustomURL && (
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={customURL}
                onChange={(e) => setCustomURL(e.target.value)}
                placeholder="Enter custom short URL"
                required={useCustomURL}
              />
            )}
            <button
              type="submit"
              className={`w-full py-2 px-4 bg-primary-500 text-white font-semibold rounded-lg shadow-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Shortening..." : "Shorten URL"}
            </button>
          </form>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">
            Social Media URL Shortener
          </h2>
          <form onSubmit={handleAddSocial} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Enter social media link"
              onChange={(e) => setSocialLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              onChange={(e) => setSocialPlatform(e.target.value)}
            >
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
            </select>
            <button className="w-full py-2 px-4 bg-primary-500 text-white font-semibold rounded-lg shadow-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75">
              Add Social
            </button>
          </form>
        </div>
      </div>
      {shortenedURL && (
        <div className="flex items-center justify-between mt-4 p-4 bg-primary-500/20 rounded-md">
          <div>
            <h2 className="text-lg font-semibold mb-2">Shortened URL:</h2>
            <Link
              to={shortenedURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:underline break-all"
            >
              {shortenedURL}
            </Link>
          </div>
          <Menu url={responseURL} />
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </motion.div>
  );
};

export default URLShortener;
