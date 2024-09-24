import PropTypes from "prop-types";
import moment from "moment/moment";
import Menu from "./Menu";
import { getFaviconUrl } from "../utils/urlUtilities";

const URLCard = ({ url }) => {
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
          <h6 className="text-sm text-primary-400">{url.originalUrl}</h6>
          <div className="flex items-center text-gray-400 text-xs">
            <span className="pr-2 border-r border-gray-300">
              Clicks: {url?.analytics.length}
            </span>
            <span className="pl-2">{moment(url.createdAt).fromNow()}</span>
          </div>
        </div>
      </div>
      <Menu url={url} />
    </li>
  );
};

URLCard.propTypes = {
  url: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    originalUrl: PropTypes.string.isRequired,
    shortUrl: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    analytics: PropTypes.array.isRequired,
  }).isRequired,
};

export default URLCard;
