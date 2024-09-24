import { FaRegCopy } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { BsQrCode } from "react-icons/bs";
import {
  IoAnalyticsOutline,
  IoCheckmark,
  IoOpenOutline,
  IoShareSocial,
} from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useState, useRef, useEffect } from "react";
import EditURLModal from "./EditURLModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import QRCodeModal from "./QRCodeModal";
import PropTypes from "prop-types";
import { copyShortUrl, shareUrl } from "../utils/urlUtilities";

const Menu = ({ url }) => {
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
    copyShortUrl(url.shortUrl).then(() => {
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
    shareUrl(url.shortUrl);
    setIsMenuOpen(false);
  };
  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="cursor-pointer hover:bg-primary-100 p-2 rounded-full active:bg-primary-200 transition-all duration-300"
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
                <Link
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  to={`/analytics/${url.shortUrl}`}
                >
                  <IoAnalyticsOutline />
                  View Analytics
                </Link>
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
    </>
  );
};

Menu.propTypes = {
  url: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    originalUrl: PropTypes.string.isRequired,
    shortUrl: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default Menu;
