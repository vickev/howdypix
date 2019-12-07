import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
  NexusGenRootTypes
} from "@howdypix/graphql-schema/schema.d";
import { appDebug, generateThumbnailUrls } from "@howdypix/utils";
import { parse } from "path";
import { Photo as EntityPhoto } from "../../entity/Photo";
import { Album as EntityAlbum } from "../../entity/Album";
import config from "../../config";
import { ApolloContext } from "../../types.d";

const debug = appDebug("gql");

export const getAlbumResolver = () => async (
  root: {},
  args: NexusGenArgTypes["Query"]["getAlbum"],
  ctx: ApolloContext
): Promise<NexusGenFieldTypes["Query"]["getAlbum"]> => {
  const album: NexusGenFieldTypes["Query"]["getAlbum"]["album"] = {
    name: (args.album && parse(args.album).base) || "",
    dir: args.album ?? "",
    source: args.source,
    nbAlbums: 0,
    nbPhotos: 0,
    preview: ""
  };

  debug(`Fetching album ${args.album}.`);

  const photoRepository = ctx.connection.getRepository(EntityPhoto);
  const albumRepository = ctx.connection.getRepository(EntityAlbum);

  const photos = await photoRepository.find({
    where: { dir: args.album ?? "", source: args.source }
  });

  const albums = await albumRepository
    .createQueryBuilder("albums")
    .where({ parentDir: args.album ?? "", source: args.source })
    .getMany();

  if (album) {
    album.nbPhotos = photos.length;
    album.nbAlbums = albums.length;
    album.preview =
      photos.length > 0
        ? generateThumbnailUrls(config.serverApi.baseUrl, photos[0])[0].url
        : null;
  }

  debug(`${photos.length} photos; ${albums.length} sub-albums.`);

  return {
    photos: photos.map(photo => ({
      id: photo.id.toString(),
      thumbnails: generateThumbnailUrls(config.serverApi.baseUrl, photo).map(
        tn => tn.url
      ),
      file: photo.file
    })),
    albums: albums
      .map((album): NexusGenRootTypes["Album"] => ({
        name: parse(album.dir).base,
        dir: album.dir,
        source: album.source,
        nbAlbums: album.nbAlbums,
        nbPhotos: album.nbPhotos,
        preview: generateThumbnailUrls(config.serverApi.baseUrl, {
          file: album.preview,
          dir: album.dir,
          source: album.source
        }).map(tn => tn.url)[0]
      }))
      .filter(a => a.dir),
    album
  };
};
