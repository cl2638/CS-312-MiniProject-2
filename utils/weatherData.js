const axios = require("axios");

const openuv = {
  BASE_URL: "https://api.openuv.io/api/v1",
  SECRET_KEY: "openuv-7c1arrmc462oom-io"
};

const getUVData = async (lat, lng) => {
  try {
    const response = await axios.get(`${openuv.BASE_URL}/uv`, {
      headers: { "x-access-token": openuv.SECRET_KEY },
      params: { lat, lng }
    });
    // Debug log to check data:
    // console.log("OpenUV API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching UV data:", error.response?.data || error.message);
    throw new Error("Failed to get UV data");
  }
};

module.exports = getUVData;
