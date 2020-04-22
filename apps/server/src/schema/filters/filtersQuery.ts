import { arg, queryField, stringArg } from "nexus";
import { getFiltersResolver } from "./filtersResolvers";
import { EnhancedQuery, ApolloContext } from "../../types.d";

export const getFilters: EnhancedQuery = () =>
  queryField("getFilters", {
    type: "GetFilters",
    args: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      album: stringArg(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      source: stringArg({ required: true }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      filterBy: arg({
        type: "PhotosFilterBy",
        required: false,
      }),
    },
    authorize: (root, args, ctx: ApolloContext) => !!ctx.user,
    resolve: getFiltersResolver(),
  });
