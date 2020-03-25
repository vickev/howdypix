import { arg, queryField, stringArg } from "nexus";
import { getFiltersResolver } from "./filtersResolvers";
import { EnhancedQuery } from "../../types.d";

export const getFilters: EnhancedQuery = () =>
  queryField("getFilters", {
    type: "GetFilters",
    args: {
      album: stringArg(),
      source: stringArg({ required: true }),
      filterBy: arg({
        type: "PhotosFilterBy",
        required: false,
      }),
    },
    authorize: (root, args, ctx) => !!ctx.user,
    resolve: getFiltersResolver(),
  });
