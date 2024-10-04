import { Link } from "react-router-dom";
import { copyShortUrl, shareUrl } from "../utils/urlUtilities";
import { MdOutlineShare, MdOutlineDelete } from "react-icons/md";
import { IoCheckmark, IoOpenOutline } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa";
import { BsQrCode } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { useEffect, useState } from "react";
import EditURLModal from "./EditURLModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import QRCodeModal from "./QRCodeModal";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";
const URLOptions = ({ url }) => {
  const [copyStatus, setCopyStatus] = useState({ copied: false, timer: null });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (copyStatus.timer) {
        clearTimeout(copyStatus.timer);
      }
    };
  }, [copyStatus.timer]);

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
    <div className="flex items-center gap-2">
      <Link
        to={`${import.meta.env.VITE_SHORTEN_BASE_URL}/${url?.shortUrl}`}
        target="_blank"
        className="p-2 rounded-md border border-primary-500 text-primary-500 hover:bg-primary-100 active:bg-primary-200 transition-all"
        id="visitURL"
      >
        <IoOpenOutline size={20} />
        <Tooltip
          anchorSelect="#visitURL"
          place="bottom"
          style={{ fontSize: "12px", padding: "4px 8px" }}
        >
          Visit URL
        </Tooltip>
      </Link>
      <button
        onClick={handleCopyShortUrl}
        id="copyURL"
        className="p-2 rounded-md border border-primary-500 text-primary-500 hover:bg-primary-100 active:bg-primary-200 transition-all"
      >
        {copyStatus.copied ? (
          <IoCheckmark size={20} className="text-green-500" />
        ) : (
          <FaRegCopy size={20} />
        )}
        <Tooltip
          anchorSelect="#copyURL"
          place="bottom"
          style={{ fontSize: "12px", padding: "4px 8px" }}
        >
          Copy URL
        </Tooltip>
      </button>
      <button
        onClick={handleEdit}
        id="editURL"
        className="p-2 rounded-md border border-primary-500 text-primary-500 hover:bg-primary-100 active:bg-primary-200 transition-all"
      >
        <CiEdit size={20} />
        <Tooltip
          anchorSelect="#editURL"
          place="bottom"
          style={{ fontSize: "12px", padding: "4px 8px" }}
        >
          Edit URL
        </Tooltip>
      </button>
      <button
        onClick={generateQRCode}
        id="generateQRCode"
        className="p-2 rounded-md border border-primary-500 text-primary-500 hover:bg-primary-100 active:bg-primary-200 transition-all"
      >
        <BsQrCode size={20} />
        <Tooltip
          anchorSelect="#generateQRCode"
          place="bottom"
          style={{ fontSize: "12px", padding: "4px 8px" }}
        >
          Generate QR Code
        </Tooltip>
      </button>
      <button
        onClick={handleShare}
        id="shareURL"
        className="p-2 rounded-md border border-primary-500 text-primary-500 hover:bg-primary-100 active:bg-primary-200 transition-all"
      >
        <MdOutlineShare size={20} />
        <Tooltip
          anchorSelect="#shareURL"
          place="bottom"
          style={{ fontSize: "12px", padding: "4px 8px" }}
        >
          Share URL
        </Tooltip>
      </button>
      <button
        onClick={handleDelete}
        id="deleteURL"
        className="p-2 rounded-md border border-red-500 text-red-500 hover:bg-red-100 active:bg-red-200 transition-all"
      >
        <MdOutlineDelete size={20} />
        <Tooltip
          anchorSelect="#deleteURL"
          place="bottom"
          style={{ fontSize: "12px", padding: "4px 8px" }}
        >
          Delete URL
        </Tooltip>
      </button>
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
        isAnalyticsPage
      />
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        url={`${import.meta.env.VITE_SHORTEN_BASE_URL}/${url?.shortUrl}`}
      />
    </div>
  );
};

URLOptions.propTypes = {
  url: PropTypes.object.isRequired, // Added prop validation for 'url'
};

export default URLOptions;
