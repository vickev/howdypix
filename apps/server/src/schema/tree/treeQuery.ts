import { queryField, stringArg } from "nexus";
import { getTreeResolver } from "./treeResolvers";
import { EnhancedQuery } from "../../types.d";

export const getTree: EnhancedQuery = () =>
  queryField("getTree", {
    type: "GetTree",
    args: {
      album: stringArg({ required: true }),
      source: stringArg({ required: true }),
    },
    authorize: (root, args, ctx) => !!ctx.user,
    resolve: getTreeResolver(),
  });
