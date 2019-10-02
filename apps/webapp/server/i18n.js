/*
  Do not copy/paste this file. It is used internally
  to manage end-to-end test suites.
*/

const NextI18Next = require("next-i18next").default;

const localeSubpathVariations = {
  none: {},
  foreign: {
    fr: "fr"
  },
  all: {
    en: "en",
    fr: "fr"
  }
};

module.exports = new NextI18Next({
  defaultLanguage: "en",
  otherLanguages: ["fr"],
  localeSubpaths: localeSubpathVariations["none"],
  detection: {
    lookupCookie: "lang",
    order: ["querystring", "cookie", "header"],
    lookupQuerystring: "lang",
    caches: ["cookie"]
  }
});
