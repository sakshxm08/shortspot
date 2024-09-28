import { motion } from "framer-motion";
import URLCard from "../components/URLCard";
import { useURLs } from "../hooks/useURLs";
import { LuRefreshCw } from "react-icons/lu";

const MyURLs = () => {
  const { urls, loading, error, fetchUrls } = useURLs();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto mt-10 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Your Shortened URLs</h1>
        <button
          onClick={fetchUrls}
          className="border p-2 flex items-center gap-2 justify-center text-sm font-bold hover:border-primary-500 hover:bg-primary-500/10 transition-all"
        >
          <LuRefreshCw /> Refresh
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {urls.map((url) => (
          <URLCard key={url._id} url={url} />
        ))}
      </ul>
    </motion.div>
  );
};

export default MyURLs;
