const config = require("@howdypix/jest-config");

config.setupFilesAfterEnv = [
  ...(config.setupFilesAfterEnv || []),
  "jest-extended",
];

if (process.env.NODE_ENV === "e2e") {
  config.testMatch = ["**/e2e/**/*.spec.[jt]s?(x)"];
  config.setupFiles = ["./e2e/setup.ts"];
}

module.exports = config;
