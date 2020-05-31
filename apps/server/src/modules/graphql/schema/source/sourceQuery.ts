import { extendType } from "nexus";
import { getSourcesResolver } from "./sourceResolvers";
import { EnhancedQuery } from "../../../../types";

export const getSources: EnhancedQuery = (appConfig, userConfig) =>
  extendType({
    type: "Query",
    definition(t) {
      t.field("getSources", {
        type: "Source",
        list: [false],
        resolve: getSourcesResolver(userConfig.photoDirs),
      });
    },
  });
