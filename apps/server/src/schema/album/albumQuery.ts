import { queryField, stringArg, arg } from "nexus";
import { getAlbumResolver } from "./albumResolvers";
import { EnhancedQuery } from "../../types.d";

export const getAlbum: EnhancedQuery = () =>
  queryField("getAlbum", {
    type: "GetAlbumPhotos",
    args: {
      album: stringArg(),
      source: stringArg({ required: true })
    },
    authorize: (root, args, ctx) => !!ctx.user,
    resolve: getAlbumResolver()
  });
