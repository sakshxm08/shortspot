import { useContext } from "react";
import { URLContext } from "../context/URLsContext";

export const useURLs = () => {
  const context = useContext(URLContext);
  if (!context) {
    throw new Error("useURLs must be used within a URLProvider");
  }
  return context;
};
