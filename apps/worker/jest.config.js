const config = require("@howdypix/jest-config");

if (process.env.NODE_ENV === "e2e") {
  config.testMatch = ["**/e2e/**/*.spec.[jt]s?(x)"];
}

module.exports = config;
