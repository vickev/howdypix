import { nonNull, nullable, queryField, stringArg } from "nexus";
import { getAlbumResolver } from "./albumResolvers";
import { ApolloContext, EnhancedQuery } from "../../types.d";

export const getAlbum: EnhancedQuery = () =>
  queryField("getAlbum", {
    type: nonNull("GetAlbumPhotos"),
    args: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      album: nullable(stringArg()),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      source: stringArg(),
    },
    authorize: (root: unknown, args: unknown, ctx: ApolloContext) => !!ctx.user,
    resolve: getAlbumResolver(),
  });
