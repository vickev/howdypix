import { nonNull, queryField, stringArg } from "nexus";
import { getTreeResolver } from "./treeResolvers";
import { ApolloContext, EnhancedQuery } from "../../types.d";

export const getTree: EnhancedQuery = () =>
  queryField("getTree", {
    type: nonNull("GetTree"),
    args: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      album: nonNull(stringArg()),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      source: nonNull(stringArg()),
    },
    authorize: (root: unknown, args: unknown, ctx: ApolloContext) => !!ctx.user,
    resolve: getTreeResolver(),
  });
