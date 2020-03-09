const path = require("path");
const fs = require("fs");
const _ = require("lodash");

const scopes = _.pullAll(
  ["apps", "libs", "services"].reduce(
    (arr, directory) => [
      ...arr,
      ...fs.readdirSync(path.join(__dirname, directory))
    ],
    ["root"]
  ),
  ["README.md"]
);

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [2, "always", scopes]
  }
};
