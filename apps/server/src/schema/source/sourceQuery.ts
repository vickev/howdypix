import { extendType, nonNull, list, nullable } from "nexus";
import { getSourcesResolver } from "./sourceResolvers";
import { EnhancedQuery } from "../../types.d";

export const getSources: EnhancedQuery = (appConfig, userConfig) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  extendType({
    type: "Query",
    definition(t) {
      t.field("getSources", {
        type: list(nullable("Source")),
        resolve: getSourcesResolver(userConfig.photoDirs),
      });
    },
  });
