import { queryField, stringArg } from "nexus";
import { getAlbumResolver } from "./albumResolvers";
import { ApolloContext, EnhancedQuery } from "../../types.d";

export const getAlbum: EnhancedQuery = () =>
  queryField("getAlbum", {
    type: "GetAlbumPhotos",
    args: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      album: stringArg(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      source: stringArg({ required: true }),
    },
    authorize: (root, args, ctx: ApolloContext) => !!ctx.user,
    resolve: getAlbumResolver(),
  });
