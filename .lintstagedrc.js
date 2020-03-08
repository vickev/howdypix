const quote = require("shell-quote").quote;
var shell = require("shelljs");

module.exports = {
  "*.{js,jsx,ts,tsx}": filenames =>
    filenames.reduce((commands, filename) => {
      commands.push(
        quote(["prettier", "--write", filename]),
        quote(["git", "add", filename])
      );

      return commands;
    }, []),
  "CHANGELOG.md": () => "yarn lint:changelogs"
};
