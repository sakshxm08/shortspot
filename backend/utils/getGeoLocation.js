import axios from "axios";

export const getGeolocation = async (ip) => {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    return null;
  }
};
