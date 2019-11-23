import { objectType, queryField, stringArg } from "nexus";
import { createConnection } from "typeorm";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { appDebug, generateThumbnailUrls } from "@howdypix/utils";
import { parse } from "path";
import config from "../config";
import ormConfig from "../../ormconfig.json";
import { Photo as EntityPhoto } from "../entity/Photo";

export const GetPhotos = () =>
  objectType({
    name: "GetPhotos",
    definition(t) {
      t.field("photos", { type: "Photo", list: [false] });
      t.field("albums", { type: "Album", list: [true] });
      t.field("album", { type: "Album", nullable: true });
    }
  });

export const Query = () =>
  queryField("getAlbum", {
    type: "GetPhotos",
    args: {
      album: stringArg(),
      source: stringArg()
    },
    authorize: (root, args, ctx) => !!ctx.user,
    resolve: async (root, args) => {
      const debug = appDebug("gql");

      const album =
        (args.album &&
          args.source && {
            name: parse(args.album).base,
            dir: args.album,
            source: args.source
          }) ||
        null;

      // Open the connection
      const connection = await createConnection({
        ...(ormConfig as SqliteConnectionOptions),
        name: "tmp2"
      });

      debug(`Fetching album ${args.album}.`);

      const photoRepository = connection.getRepository(EntityPhoto);

      const photos = await photoRepository.find(
        args.album
          ? {
              where: { dir: args.album, source: args.source }
            }
          : { where: { dir: "", source: args.source } }
      );

      const albums: { dir: string; source: string }[] = await photoRepository
        .createQueryBuilder("photo")
        .select("DISTINCT dir, source")
        .where(
          args.album
            ? { parentDir: args.album, source: args.source }
            : { parentDir: "", source: args.source }
        )
        .getRawMany();

      // Close the connection
      await connection.close();

      debug(`${photos.length} photos; ${albums.length} sub-albums.`);

      return {
        photos: photos.map(photo => ({
          id: photo.id.toString(),
          thumbnails: generateThumbnailUrls(
            config.serverApi.baseUrl,
            photo
          ).map(tn => tn.url)
        })),
        albums: albums
          .map(album => ({ ...album, name: parse(album.dir).base }))
          .filter(a => a.dir),
        album
      };
    }
  });
