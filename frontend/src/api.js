import axios from "axios";

const baseURL = "http://localhost:4000/api"; // Replace with your actual API base URL

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept requests to add the authorization token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  login: (credentials) => api.post("/login", credentials),
  signup: (userData) => api.post("/register", userData),
  getCurrentUser: () => api.get("/verify-token"),
  shortenURL: (urlData) => api.post("/shorten", urlData),
  getUserURLs: () => api.get("/dashboard"),
  // Add other API methods here
};

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
