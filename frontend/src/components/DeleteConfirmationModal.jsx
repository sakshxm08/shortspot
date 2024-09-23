import PropTypes from "prop-types";
import { useURLs } from "../hooks/useURLs";
import { useState } from "react";
import api from "../api";

const DeleteConfirmationModal = ({ isOpen, onClose, url, urlToDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { urls, setUrls } = useURLs();

  const handleClose = () => {
    onClose();
    setError("");
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.deleteURL(url._id);
      setUrls(urls.filter((el) => url._id !== el._id));
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Confirm Deletion</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="mb-6">
          <p className="mb-4">
            Are you sure you want to delete this shortened URL?
          </p>
          <p className="font-semibold">{urlToDelete}</p>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-28 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  url: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  urlToDelete: PropTypes.string.isRequired,
};

export default DeleteConfirmationModal;
