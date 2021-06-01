import { nonNull, nullable, queryField, stringArg } from "nexus";
import { getSearchResolver } from "./searchResolvers";
import { ApolloContext, EnhancedQuery } from "../../types.d";
import { withOrderByQueryArg, withFilterByQueryArg } from "../mixins";

export const getSearch: EnhancedQuery = () =>
  queryField("getSearch", {
    type: "GetSearchPhotos",
    args: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      album: nullable(stringArg()),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      source: nullable(stringArg()),
      ...withOrderByQueryArg(),
      ...withFilterByQueryArg(),
    },
    authorize: (root: unknown, args: unknown, ctx: ApolloContext) => !!ctx.user,
    resolve: getSearchResolver(),
  });
