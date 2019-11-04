// Load env variables
require("dotenv").config();

const serverRuntimeConfig = {
  port: process.env.PORT || 3000,
  baseUrl: undefined,
  serverApollo: {
    url: process.env.APOLLO_BASE_URL || "http://localhost:4005"
  }
};

const publicRuntimeConfig = {
  baseUrl: undefined
};

serverRuntimeConfig.baseUrl = publicRuntimeConfig.baseUrl =
  process.env.BASE_URL || `http://localhost:${serverRuntimeConfig.port}`;

module.exports = { serverRuntimeConfig, publicRuntimeConfig };
