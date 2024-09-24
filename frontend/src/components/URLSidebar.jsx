import { NavLink } from "react-router-dom";
import { useURLs } from "../hooks/useURLs";
import PropTypes from "prop-types";
import moment from "moment";
import { getFaviconUrl } from "../utils/urlUtilities";

const URLSidebar = () => {
  const { urls } = useURLs();
  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col">
      <h2 className="text-center font-bold py-2 bg-primary-600 text-white">
        Your Recent ShortSpots
      </h2>
      {urls.map((url) => (
        <URLSidebarCard key={url._id} url={url} />
      ))}
    </div>
  );
};

const URLSidebarCard = ({ url }) => {
  return (
    <NavLink
      to={`/analytics/${url.shortUrl}`}
      className={({ isActive }) =>
        `p-4 w-full flex justify-between border-b border-gray-300  transition-all duration-300 ${
          isActive
            ? "bg-primary-100 hover:bg-primary-100/80 active:bg-primary-200/40"
            : "hover:bg-gray-200 active:bg-gray-300"
        }`
      }
    >
      <div className="flex gap-2 w-full">
        <img
          src={getFaviconUrl(url.originalUrl)}
          alt="Favicon"
          className="w-8 h-8"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-favicon.png"; // Replace with your default favicon path
          }}
        />
        <div className="flex flex-col gap-1 w-full">
          <h4 className="font-bold">{`${
            import.meta.env.VITE_SHORTEN_BASE_URL
          }/${url.shortUrl}`}</h4>
          <h6 className="text-sm text-primary-400">{url.originalUrl}</h6>
          <div className="flex items-center justify-between text-gray-400 text-xs w-full">
            <span>{moment(url.createdAt).fromNow()}</span>
            <span>
              {url?.analytics.length > 1 || url?.analytics.length === 0
                ? `${url?.analytics.length} Clicks`
                : `${url?.analytics.length} Click`}
            </span>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

URLSidebarCard.propTypes = {
  url: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    originalUrl: PropTypes.string.isRequired,
    shortUrl: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    analytics: PropTypes.array.isRequired,
  }).isRequired,
};

export default URLSidebar;
