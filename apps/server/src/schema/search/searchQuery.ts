import { queryField, stringArg, arg } from "nexus";
import { getSearchResolver } from "./searchResolvers";
import { EnhancedQuery } from "../../types.d";

export const getSearch: EnhancedQuery = () =>
  queryField("getSearch", {
    type: "GetSearchPhotos",
    args: {
      album: stringArg(),
      source: stringArg(),
      orderBy: arg({
        type: "PhotosOrderBy",
        required: false,
        default: "DATE_DESC"
      }),
      filterBy: arg({
        type: "PhotosFilterBy",
        required: false
      })
    },
    authorize: (root, args, ctx) => !!ctx.user,
    resolve: getSearchResolver()
  });
