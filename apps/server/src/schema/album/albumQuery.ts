import { queryField, stringArg } from "nexus";
import { getAlbumResolver } from "./albumResolvers";
import { EnhancedQuery } from "../../types.d";

export const getAlbum: EnhancedQuery = () =>
  queryField("getAlbum", {
    type: "GetAlbumPhotos",
    args: {
      album: stringArg(),
      source: stringArg()
    },
    authorize: (root, args, ctx) => !!ctx.user,
    resolve: getAlbumResolver()
  });
