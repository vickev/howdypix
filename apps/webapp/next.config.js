// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("config");

const mock = {
  serverApi: {
    port: 4004,
    url: undefined,
  },
};
mock.serverApi.url = `http://localhost:${mock.serverApi.port}`;

const serverRuntimeConfig = {
  port: config.get("app.webapp.port") || 3000,
  baseUrl: undefined,
  serverApi: {
    // If we mock the API server, then we use the mocked API server URL
    url: process.env.MOCK_API
      ? mock.serverApi.url
      : config.get("app.api.baseUrl") || "http://localhost:3004",
  },
  mock,
};

const publicRuntimeConfig = {
  baseUrl: undefined,
};

serverRuntimeConfig.baseUrl =
  config.get("app.webapp.baseUrl") ||
  `http://localhost:${serverRuntimeConfig.port}`;

publicRuntimeConfig.baseUrl = serverRuntimeConfig.baseUrl;

// Enable experimental mode to have the catch-all routing
// @see https://github.com/zeit/next.js/pull/9416/files
// @see https://github.com/zeit/next.js/issues/9081
// @see https://github.com/zeit/next.js/issues/9390
const experimental = {
  modern: true,
  catchAllRouting: true,
};

module.exports = { serverRuntimeConfig, publicRuntimeConfig, experimental };
