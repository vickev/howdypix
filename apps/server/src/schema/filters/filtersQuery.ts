import { arg, nonNull, nullable, queryField, stringArg } from "nexus";
import { getFiltersResolver } from "./filtersResolvers";
import { EnhancedQuery, ApolloContext } from "../../types.d";

export const getFilters: EnhancedQuery = () =>
  queryField("getFilters", {
    type: nonNull("GetFilters"),
    args: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      album: nullable(stringArg()),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      source: nonNull(stringArg()),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      filterBy: arg({
        type: nullable("PhotosFilterBy"),
      }),
    },
    authorize: (root: unknown, args: unknown, ctx: ApolloContext) => !!ctx.user,
    resolve: getFiltersResolver(),
  });
