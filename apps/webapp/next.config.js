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
    // If we mock the API server, then we use the mocked API server URL
    url: process.env.MOCK_API
      ? mock.serverApi.url
      : process.env.API_BASE_URL || "http://localhost:3004"
  },
  mock
};

const publicRuntimeConfig = {
  baseUrl: undefined
};

serverRuntimeConfig.baseUrl =
  process.env.BASE_URL || `http://localhost:${serverRuntimeConfig.port}`;

publicRuntimeConfig.baseUrl = serverRuntimeConfig.baseUrl;

// Enable experimental mode to have the catch-all routing
// @see https://github.com/zeit/next.js/pull/9416/files
// @see https://github.com/zeit/next.js/issues/9081
// @see https://github.com/zeit/next.js/issues/9390
const experimental = {
  modern: true,
  catchAllRouting: true
};

module.exports = { serverRuntimeConfig, publicRuntimeConfig, experimental };
