// Load env variables
require("dotenv").config();

const serverRuntimeConfig = {
  port: process.env.PORT || 3000,
  baseUrl: undefined,
  serverApi: {
    url: process.env.API_BASE_URL || "http://localhost:3004"
  }
};

const publicRuntimeConfig = {
  baseUrl: undefined
};

serverRuntimeConfig.baseUrl = publicRuntimeConfig.baseUrl =
  process.env.BASE_URL || `http://localhost:${serverRuntimeConfig.port}`;

module.exports = { serverRuntimeConfig, publicRuntimeConfig };
