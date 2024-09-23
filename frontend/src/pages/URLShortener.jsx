import { useState } from "react";
import api from "../api";

const URLShortener = () => {
  const [inputURL, setInputURL] = useState("");
  const [customURL, setCustomURL] = useState("");
  const [useCustomURL, setUseCustomURL] = useState(false);
  const [shortenedURL, setShortenedURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [protocol, setProtocol] = useState("https");

  const isValidURL = (url) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i" // fragment locator
    );
    return !!pattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (useCustomURL && customURL.includes("/")) {
      setError("Custom URL cannot contain slashes");
      setIsLoading(false);
      return;
    }

    if (inputURL.startsWith("http:") || inputURL.startsWith("https:")) {
      setError(
        "Please remove the protocol from the URL and select it from the dropdown."
      );
      setIsLoading(false);
      return;
    }

    let fullURL = `${protocol}://${inputURL}`;

    if (!isValidURL(fullURL)) {
      setError("Please enter a valid URL.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.shortenURL({
        originalUrl: fullURL,
        customUrl: customURL,
        useCustomUrl: useCustomURL,
      });

      setShortenedURL(response.data.shortUrl);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to shorten URL");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4 text-center">URL Shortener</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex">
          <select
            value={protocol}
            onChange={(e) => setProtocol(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="http">http://</option>
            <option value="https">https://</option>
          </select>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="mr-2"
            checked={useCustomURL}
            onChange={(e) => setUseCustomURL(e.target.checked)}
          />
          <label htmlFor="useCustomURL">Use custom URL</label>
        </div>
        {useCustomURL && (
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={customURL}
            onChange={(e) => setCustomURL(e.target.value)}
            placeholder="Enter custom short URL"
            required={useCustomURL}
          />
        )}
        <button
          type="submit"
          className={`w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>
      {shortenedURL && (
        <div className="mt-4 p-4 bg-blue-100 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Shortened URL:</h2>
          <a
            href={shortenedURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {shortenedURL}
          </a>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default URLShortener;
