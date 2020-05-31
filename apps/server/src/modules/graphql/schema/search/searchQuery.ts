import { queryField, stringArg } from "nexus";
import { getSearchResolver } from "./searchResolvers";
import { ApolloContext, EnhancedQuery } from "../../../../types";
import { withOrderByQueryArg, withFilterByQueryArg } from "../mixins";

export const getSearch: EnhancedQuery = () =>
  queryField("getSearch", {
    type: "GetSearchPhotos",
    args: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      album: stringArg(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      source: stringArg(),
      ...withOrderByQueryArg(),
      ...withFilterByQueryArg(),
    },
    authorize: (root, args, ctx: ApolloContext) => !!ctx.user,
    resolve: getSearchResolver(),
  });
