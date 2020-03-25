/*
  Do not copy/paste this file. It is used internally
  to manage end-to-end test suites.
*/

import NextI18Next from "next-i18next";
import { formatDate } from "../src/lib/dateUtils";

const localeSubpathVariations = {
  none: {},
  foreign: {
    fr: "fr",
  },
  all: {
    en: "en",
    fr: "fr",
  },
};

export default new NextI18Next({
  defaultLanguage: "en",
  otherLanguages: ["fr"],
  localeSubpaths: localeSubpathVariations.none,
  detection: {
    lookupCookie: "lang",
    order: ["querystring", "cookie", "header"],
    lookupQuerystring: "lang",
    caches: ["cookie"],
  },
  interpolation: {
    format(value, format, lng): typeof value {
      if (format === "formatDate" && value instanceof Date)
        return formatDate(lng, value);
      return value;
    },
  },
});
