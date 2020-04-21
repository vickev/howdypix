module.exports = {
  ...require("@howdypix/jest-config"),
  collectCoverage: true,
  collectCoverageFrom: ["lib/**/*.ts"],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
