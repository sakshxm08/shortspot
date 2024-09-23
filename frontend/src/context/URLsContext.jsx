import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const URLContext = createContext();

export const URLProvider = ({ children }) => {
  const [urls, setUrls] = useState([]);

  return (
    <URLContext.Provider value={{ urls, setUrls }}>
      {children}
    </URLContext.Provider>
  );
};
URLProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
