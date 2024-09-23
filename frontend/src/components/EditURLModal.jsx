import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import api from "../api";
import { useURLs } from "../hooks/useURLs";

const EditURLModal = ({ url, onClose }) => {
  const [originalUrl, setOriginalUrl] = useState(url.originalUrl);
  const [customUrl, setCustomUrl] = useState(url.shortUrl);

  const { urls, setUrls } = useURLs();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleClose = () => {
    onClose();
    setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.updateURL(url._id, {
        originalUrl: originalUrl,
        customUrl: customUrl,
      });
      setUrls(urls.map((el) => (url._id === el._id ? response.data : el)));
      handleClose();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-20">
      <div
        ref={modalRef}
        className="bg-white p-5 rounded-lg shadow-xl w-96 z-20"
      >
        <h2 className="text-xl font-bold mb-4">Edit URL</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="originalUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Original URL
            </label>
            <input
              type="url"
              id="originalUrl"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-200 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="customUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Custom URL
            </label>
            <div className="flex py-1">
              <span className="text-gray-800 font-light bg-gray-200 p-2 border border-gray-200 rounded-l-md">
                {import.meta.env.VITE_SHORTEN_BASE_URL}/
              </span>
              <input
                type="text"
                id="customUrl"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full p-2 border rounded-r-md border-gray-200 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-800 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditURLModal.propTypes = {
  url: PropTypes.shape({
    originalUrl: PropTypes.string.isRequired,
    shortUrl: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditURLModal;
