import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment/moment";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useState, useRef, useEffect } from "react";
import { FaRegCopy } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { BsQrCode } from "react-icons/bs";
import { IoCheckmark, IoOpenOutline, IoShareSocial } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import EditURLModal from "./EditURLModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import QRCodeModal from "./QRCodeModal";

const URLCard = ({ url }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState({ copied: false, timer: null });

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (copyStatus.timer) {
        clearTimeout(copyStatus.timer);
      }
    };
  }, [copyStatus.timer]);

  const handleCopyShortUrl = () => {
    const shortUrl = `${import.meta.env.VITE_SHORTEN_BASE_URL}/${url.shortUrl}`;
    navigator.clipboard.writeText(shortUrl).then(() => {
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
    setIsMenuOpen(false);
  };

  const handleShare = async () => {
    const shortUrl = `${import.meta.env.VITE_SHORTEN_BASE_URL}/${url.shortUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this shortened URL",
          url: shortUrl,
          text: "I created this shortened URL using ShortSpot.",
        });
        console.log("URL shared successfully");
      } catch (error) {
        console.error("Error sharing URL:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      handleCopyShortUrl();
      alert(
        "Sharing is not supported on this browser. The URL has been copied to your clipboard."
      );
    }
    setIsMenuOpen(false);
  };

  const getFaviconUrl = (originalUrl) => {
    try {
      const domain = new URL(originalUrl).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch (error) {
      console.error("Error parsing URL:", error);
      return null;
    }
  };

  return (
    <li className="shadow-lg bg-white px-6 py-5 rounded-lg flex justify-between">
      <div className="flex gap-2">
        <img
          src={getFaviconUrl(url.originalUrl)}
          alt="Favicon"
          className="w-8 h-8"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-favicon.png"; // Replace with your default favicon path
          }}
        />

        <div className="flex flex-col gap-1 ">
          <h4 className="font-bold text-lg">{`${
            import.meta.env.VITE_SHORTEN_BASE_URL
          }/${url.shortUrl}`}</h4>
          <h6 className="text-sm text-blue-400">{url.originalUrl}</h6>
          <div className="flex items-center text-gray-400 text-xs">
            <span className="pr-2 border-r border-gray-300">Clicks: 0</span>
            <span className="pl-2">{moment(url.createdAt).fromNow()}</span>
          </div>
        </div>
      </div>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="cursor-pointer hover:bg-gray-100 p-2 rounded-full active:bg-gray-200 transition-all duration-300"
        >
          <HiOutlineDotsHorizontal size={24} />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-custom z-10">
            <ul className="py-1">
              <li>
                <Link
                  to={`${import.meta.env.VITE_SHORTEN_BASE_URL}/${
                    url.shortUrl
                  }`}
                  target="_blank"
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                >
                  <IoOpenOutline /> Visit
                </Link>
              </li>
              <li>
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleCopyShortUrl}
                >
                  {copyStatus.copied ? (
                    <>
                      <IoCheckmark className="text-green-500" />
                      <span className="text-green-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <FaRegCopy className="text-gray-700" />
                      <span className="text-gray-700">Copy Short URL</span>
                    </>
                  )}
                </button>
              </li>
              <li>
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setIsEditModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <CiEdit /> Edit
                </button>
              </li>
              <li>
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={generateQRCode}
                >
                  <BsQrCode />
                  Generate QR Code
                </button>
              </li>
              <li>
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleShare}
                >
                  <IoShareSocial />
                  Share
                </button>
              </li>
              <li>
                <button
                  className="flex items-center text-red-500 gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <MdDeleteOutline />
                  Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      {isEditModalOpen && (
        <EditURLModal url={url} onClose={() => setIsEditModalOpen(false)} />
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        url={url}
        urlToDelete={`${import.meta.env.VITE_SHORTEN_BASE_URL}/${url.shortUrl}`}
      />
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        url={`${import.meta.env.VITE_SHORTEN_BASE_URL}/${url.shortUrl}`}
      />
    </li>
  );
};

URLCard.propTypes = {
  url: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    originalUrl: PropTypes.string.isRequired,
    shortUrl: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default URLCard;
