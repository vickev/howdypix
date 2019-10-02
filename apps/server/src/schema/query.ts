import { intArg, objectType, queryField, stringArg } from "nexus";
import { Photo as EntityPhoto } from "../entity/Photo";
import { createConnection, Like } from "typeorm";
import ormConfig from "../../ormconfig.json";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { appDebug, generateThumbnailUrls } from "@howdypix/utils";
import config from "config";
import { parse } from "path";

export const GetPhotos = objectType({
  name: "GetPhotos",
  definition(t) {
    t.field("photos", { type: "Photo", list: [false] });
    t.field("albums", { type: "Album", list: [true] });
  }
});

export const Query = queryField("getAlbum", {
  type: "GetPhotos",
  args: {
    album: stringArg(),
    source: stringArg()
  },
  resolve: async (root, args) => {
    const debug = appDebug("gql");

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
          config.get("serverHttp.baseUrl"),
          photo
        ).map(tn => tn.url)
      })),
      albums: albums
        .map(album => ({ ...album, name: parse(album.dir).base }))
        .filter(a => a.dir)
    };
  }
});
