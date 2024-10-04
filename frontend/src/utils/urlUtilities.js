export const getFaviconUrl = (originalUrl) => {
  try {
    const domain = new URL(originalUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return null;
  }
};

export const copyShortUrl = async (url) => {
  const shortUrl = `${import.meta.env.VITE_SHORTEN_BASE_URL}/${url}`;
  return navigator.clipboard.writeText(shortUrl);
};

export const shareUrl = async (url) => {
  const shortUrl = `${import.meta.env.VITE_SHORTEN_BASE_URL}/${url}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Check out this shortened URL",
        url: shortUrl,
        text: "I created this shortened URL using ShortSpot.",
      });
    } catch (error) {
      console.error("Error sharing URL:", error);
    }
  } else {
    // Fallback for browsers that don't support the Web Share API
    copyShortUrl(url);
    alert(
      "Sharing is not supported on this browser. The URL has been copied to your clipboard."
    );
  }
};
