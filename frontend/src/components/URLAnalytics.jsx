import { Link, useParams } from "react-router-dom";
import { copyShortUrl, getFaviconUrl, shareUrl } from "../utils/urlUtilities";
import { useURLs } from "../hooks/useURLs";
import { MdOutlineShare, MdOutlineDelete } from "react-icons/md";
import { IoCheckmark, IoOpenOutline } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa";
import { BsQrCode } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { useEffect, useState } from "react";
import EditURLModal from "./EditURLModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import QRCodeModal from "./QRCodeModal";
import api from "../api";
const URLAnalytics = () => {
  const { _id } = useParams();
  const { urls, loading, setLoading, setError } = useURLs();

  const [url, setUrl] = useState(
    urls ? urls.find((url) => url?._id === _id) : null
  );

  const [copyStatus, setCopyStatus] = useState({ copied: false, timer: null });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    const fetchURL = async () => {
      setLoading(true);
      try {
        const response = await api.getURL(_id);
        setUrl(response.data);
      } catch (error) {
        setError(
          error.response?.data?.error || "An error occurred. Please try again."
        );
        console.error("Error fetching URL:", error);
      } finally {
        setLoading(false);
      }
    };
    if (!url) {
      fetchURL();
    } else {
      setUrl(urls.find((url) => url?._id === _id));
    }
  }, [_id, setLoading, setError, urls, url]);

  useEffect(() => {
    return () => {
      if (copyStatus.timer) {
        clearTimeout(copyStatus.timer);
      }
    };
  }, [copyStatus.timer]);

  if (loading || !url) {
    return <div>Loading...</div>;
  }

  const handleCopyShortUrl = () => {
    copyShortUrl(url?.shortUrl).then(() => {
      setCopyStatus({
        copied: true,
        timer: setTimeout(
          () => setCopyStatus({ copied: false, timer: null }),
          1500
        ),
      });
    });
  };

  const generateQRCode = () => {
    setIsQRModalOpen(true);
  };

  const handleShare = async () => {
    shareUrl(url?.shortUrl);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8">
            <img
              src={getFaviconUrl(url?.originalUrl)}
              alt="Favicon"
              className="w-8 h-8"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-favicon.png"; // Replace with your default favicon path
              }}
            />
          </div>
          <h4 className="font-bold text-xl">{`${
            import.meta.env.VITE_SHORTEN_BASE_URL
          }/${url?.shortUrl}`}</h4>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`${import.meta.env.VITE_SHORTEN_BASE_URL}/${url?.shortUrl}`}
            target="_blank"
            className="p-2 rounded-md border border-primary-500 text-primary-500 hover:bg-primary-100 active:bg-primary-200 transition-all"
          >
            <IoOpenOutline size={20} />
          </Link>
          <button
            onClick={handleCopyShortUrl}
            className="p-2 rounded-md border border-primary-500 text-primary-500 hover:bg-primary-100 active:bg-primary-200 transition-all"
          >
            {copyStatus.copied ? (
              <IoCheckmark size={20} className="text-green-500" />
            ) : (
              <FaRegCopy size={20} />
            )}
          </button>
          <button
            onClick={handleEdit}
            className="p-2 rounded-md border border-primary-500 text-primary-500 hover:bg-primary-100 active:bg-primary-200 transition-all"
          >
            <CiEdit size={20} />
          </button>
          <button
            onClick={generateQRCode}
            className="p-2 rounded-md border border-primary-500 text-primary-500 hover:bg-primary-100 active:bg-primary-200 transition-all"
          >
            <BsQrCode size={20} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-md border border-primary-500 text-primary-500 hover:bg-primary-100 active:bg-primary-200 transition-all"
          >
            <MdOutlineShare size={20} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-md border border-red-500 text-red-500 hover:bg-red-100 active:bg-red-200 transition-all"
          >
            <MdOutlineDelete size={20} />
          </button>
        </div>
      </div>
      {isEditModalOpen && (
        <EditURLModal url={url} onClose={() => setIsEditModalOpen(false)} />
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        url={url}
        urlToDelete={`${import.meta.env.VITE_SHORTEN_BASE_URL}/${
          url?.shortUrl
        }`}
      />
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        url={`${import.meta.env.VITE_SHORTEN_BASE_URL}/${url?.shortUrl}`}
      />
    </div>
  );
};

export default URLAnalytics;
