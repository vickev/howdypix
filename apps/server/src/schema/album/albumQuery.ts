import { queryField, stringArg } from "nexus";
import { NexusExtendTypeDef } from "nexus/dist/definitions/extendType";
import { getAlbumResolver } from "./albumResolvers";

export const getAlbum = (): NexusExtendTypeDef<"Query"> =>
  queryField("getAlbum", {
    type: "GetAlbumPhotos",
    args: {
      album: stringArg(),
      source: stringArg()
    },
    authorize: (root, args, ctx) => !!ctx.user,
    resolve: getAlbumResolver()
  });
