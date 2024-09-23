import PropTypes from "prop-types";
import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";
import { FaDownload, FaShare } from "react-icons/fa";

const QRCodeModal = ({ isOpen, onClose, url }) => {
  const qrRef = useRef(null);

  if (!isOpen) return null;

  const getQRCodeImage = () => {
    const svg = qrRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/png");
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    });
  };

  const downloadQRCode = async () => {
    const blob = await getQRCodeImage();
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "qrcode.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        const blob = await getQRCodeImage();
        const file = new File([blob], "qrcode.png", { type: "image/png" });
        await navigator.share({
          title: "QR Code",
          text: "Check out this QR code for a shortened URL!",
          files: [file],
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert(
        "Web Share API is not supported in your browser. You can download the QR code instead."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">QR Code</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="flex justify-center mb-4" ref={qrRef}>
          <QRCodeSVG value={url} size={200} />
        </div>
        <p className="text-center text-sm text-gray-600 mb-4">
          Scan this QR code to access the shortened URL
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={downloadQRCode}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FaDownload /> Download
          </button>
          <button
            onClick={shareQRCode}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <FaShare /> Share
          </button>
        </div>
      </div>
    </div>
  );
};

QRCodeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

export default QRCodeModal;
