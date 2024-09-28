import { Link, useParams } from "react-router-dom";
import { getFaviconUrl } from "../utils/urlUtilities";
import { useURLs } from "../hooks/useURLs";
import { useEffect, useState } from "react";
import URLOptions from "./URLOptions";
import { LuRefreshCw } from "react-icons/lu";
import api from "../api";
import { Bar } from "react-chartjs-2";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import moment from "moment";
import "leaflet/dist/leaflet.css";
import "chart.js/auto"; // Required for using Chart.js in React

const URLAnalytics = () => {
  const { _id } = useParams();
  const {
    urls,
    loading: urlsLoading,
    setLoading: setUrlsLoading,
    setUrls,
  } = useURLs();

  const [url, setUrl] = useState(
    urls ? urls.find((url) => url?._id === _id) : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [analytics, setAnalytics] = useState([]);
  const [filteredAnalytics, setFilteredAnalytics] = useState([]);
  const [filter, setFilter] = useState("24 hours");

  useEffect(() => {
    const currentUrl = urls.find((url) => url?._id === _id);
    setUrl(currentUrl);
    setAnalytics(currentUrl?.analytics);
    if (url) setUrlsLoading(false);
  }, [_id, urlsLoading, setUrlsLoading, urls, url]);

  useEffect(() => {
    const filterData = () => {
      const now = moment();
      let filteredData = [];

      if (!analytics) {
        return;
      }
      if (filter === "24 hours") {
        filteredData = analytics.filter((item) =>
          moment(item.timestamp).isAfter(now.subtract(1, "days"))
        );
      } else if (filter === "week") {
        filteredData = analytics.filter((item) =>
          moment(item.timestamp).isAfter(now.subtract(7, "days"))
        );
      } else if (filter === "month") {
        filteredData = analytics.filter((item) =>
          moment(item.timestamp).isAfter(now.subtract(1, "months"))
        );
      }

      if (analytics && filter) setFilteredAnalytics(filteredData);
    };

    filterData();
  }, [filter, analytics]);

  const fetchURL = async () => {
    setLoading(true);
    try {
      const response = await api.getURL(_id);
      setUrl(response.data);
      setAnalytics(response.data?.analytics);
      setUrls(
        urls.map((el) => {
          if (url._id !== el._id) return el;
          return response.data;
        })
      );
    } catch (error) {
      setError(
        error.response?.data?.error || "An error occurred. Please try again."
      );
      console.error("Error fetching URL:", error);
    } finally {
      setLoading(false);
    }
  };

  if (urlsLoading || !url || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Total human clicks (excluding spiders/bots)
  const humanClicks = filteredAnalytics.filter(
    (item) => item.deviceType !== "Spider 0.0.0"
  ).length;

  // Unique clicks (by IP and timestamp)
  const uniqueClicks = new Set(
    filteredAnalytics.map((item) => item.ip + item.timestamp)
  ).size;

  // Unique visitors (by IP)
  const uniqueVisitors = new Set(filteredAnalytics.map((item) => item.ip)).size;

  // Grouped by date for bar chart
  const groupedByDate = filteredAnalytics.reduce((acc, item) => {
    const date = moment(item.timestamp).format("YYYY-MM-DD");
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Bar chart data
  const barData = {
    labels: Object.keys(groupedByDate),
    datasets: [
      {
        label: "Number of Clicks",
        data: Object.values(groupedByDate),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="p-8 flex flex-col gap-4">
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
        <URLOptions url={url} />
      </div>
      <div className="text-gray-500 text-xs flex items-center">
        <span className="pr-2 border-r">
          {url.analytics.length} All Time Clicks
        </span>
        <span className="pl-2">
          Created {moment().diff(moment(url.createdAt), "days")} days ago on{" "}
          {moment(url.createdAt).format("MMM Do YYYY")}
        </span>
      </div>
      <Link
        to={url.originalUrl}
        className="text-primary-500 hover:underline w-fit"
      >
        {url.originalUrl}
      </Link>
      <div className="flex items-end gap-4">
        <button
          onClick={fetchURL}
          className="border p-2 flex items-center gap-2 justify-center text-sm font-bold hover:border-primary-500 hover:bg-primary-500/10 transition-all"
        >
          <LuRefreshCw /> Refresh
        </button>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Filter by Time Range
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 flex items-center gap-2 justify-center text-sm font-bold hover:border-primary-500 hover:bg-primary-500/10 transition-all focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="24 hours">Last 24 Hours</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <p className="text-lg font-semibold">Total Human Clicks</p>
          <p className="text-2xl">{humanClicks}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <p className="text-lg font-semibold">Unique Clicks</p>
          <p className="text-2xl">{uniqueClicks}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <p className="text-lg font-semibold">Unique Visitors</p>
          <p className="text-2xl">{uniqueVisitors}</p>
        </div>
      </div>
      {/* Bar Chart (Clicks by Date) */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Clicks Over Time</h2>
        <Bar data={barData} />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">World Traffic Map</h2>
        <div className="h-96 w-full">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {analytics &&
              analytics
                .filter(
                  (data) => data.location?.latitude && data.location?.longitude
                )
                .map((data, index) => (
                  <Marker
                    key={index}
                    position={[data.location.latitude, data.location.longitude]}
                  >
                    <Popup>
                      <div>
                        <p>
                          <strong>IP:</strong> {data.ip}
                        </p>
                        <p>
                          <strong>Location:</strong> {data.location.city},{" "}
                          {data.location.country}
                        </p>
                        <p>
                          <strong>Browser:</strong> {data.browser}
                        </p>
                        <p>
                          <strong>OS:</strong> {data.os}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default URLAnalytics;
