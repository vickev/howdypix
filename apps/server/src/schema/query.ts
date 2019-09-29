import { objectType, idArg, intArg, stringArg, core, queryField } from "nexus";
import { Photo } from "./photo";
import { Album } from "./album";
import { Photo as EntityPhoto } from "../entity/Photo";
import { Album as EntityAlbum } from "../entity/Album";
import { createConnection } from "typeorm";
import ormConfig from "../../ormconfig.json";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { generateThumbnailPaths } from "@howdypix/utils";
import { state } from "../state";

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
    parent: intArg()
  },
  resolve: async (root, args) => {
    // Open the connection
    const connection = await createConnection({
      ...(ormConfig as SqliteConnectionOptions),
      name: "tmp"
    });

    const albumRepository = connection.getRepository(EntityAlbum);
    const photoRepository = connection.getRepository(EntityPhoto);

    const photos = await photoRepository.find(
      args.parent
        ? {
            where: { album: { id: args.parent } }
          }
        : { where: { album: null } }
    );
    const albums = await albumRepository.find(
      args.parent
        ? {
            where: { parent: { id: args.parent } }
          }
        : { where: { parent: null } }
    );

    // Close the connection
    await connection.close();

    return {
      photos: photos.map(photo => ({
        id: photo.id.toString(),
        thumbnails: generateThumbnailPaths(
          state.userConfig.thumbnailsDir,
          photo.sourceId,
          photo.path
        ).map(tn => tn.path)
      })),
      albums: albums.map(album => ({
        id: album.id.toString(),
        name: album.path
      }))
    };
  }
});
