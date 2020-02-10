import { queryField, stringArg } from "nexus";
import { getSearchResolver } from "./searchResolvers";
import { EnhancedQuery } from "../../types.d";
import { withOrderByQueryArg, withFilterByQueryArg } from "../mixins";

export const getSearch: EnhancedQuery = () =>
  queryField("getSearch", {
    type: "GetSearchPhotos",
    args: {
      album: stringArg(),
      source: stringArg(),
      ...withOrderByQueryArg(),
      ...withFilterByQueryArg()
    },
    authorize: (root, args, ctx) => !!ctx.user,
    resolve: getSearchResolver()
  });
