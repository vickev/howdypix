// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// Cypress requires those options to be defined else it crashes, even if unused
// eslint-disable-next-line no-unused-vars

const fs = require("fs");

module.exports = (on, config) => {
  on("task", {
    getSchema() {
      return fs.readFileSync(
        require.resolve("@howdypix/graphql-schema/schema.graphql"),
        "utf8"
      );
    }
  });
};