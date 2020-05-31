import { queryField, stringArg } from "nexus";
import { getTreeResolver } from "./treeResolvers";
import { ApolloContext, EnhancedQuery } from "../../../../types";

export const getTree: EnhancedQuery = () =>
  queryField("getTree", {
    type: "GetTree",
    args: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      album: stringArg({ required: true }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      source: stringArg({ required: true }),
    },
    authorize: (root, args, ctx: ApolloContext) => !!ctx.user,
    resolve: getTreeResolver(),
  });
