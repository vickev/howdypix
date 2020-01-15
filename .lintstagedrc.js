const quote = require("shell-quote").quote;

module.exports = {
  "*.{js,jsx,ts,tsx}": filenames =>
    filenames.reduce((commands, filename) => {
      commands.push(
        quote(["prettier", "--write", filename]),
        quote(["git", "add", filename])
      );

      return commands;
    }, [])
};
