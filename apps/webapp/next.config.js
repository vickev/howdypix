// Load env variables
require("dotenv").config();

const mock = {
  serverApi: {
    port: 4004,
    url: undefined
  }
};
mock.serverApi.url = `http://localhost:${mock.serverApi.port}`;

const serverRuntimeConfig = {
  port: process.env.PORT || 3000,
  baseUrl: undefined,
  serverApi: {
    url: process.env.MOCK_API
      ? mock.serverApi.url
      : process.env.API_BASE_URL || "http://localhost:3004"
  },
  mock
};

const publicRuntimeConfig = {
  baseUrl: undefined
};

serverRuntimeConfig.baseUrl = publicRuntimeConfig.baseUrl =
  process.env.BASE_URL || `http://localhost:${serverRuntimeConfig.port}`;

module.exports = { serverRuntimeConfig, publicRuntimeConfig };
