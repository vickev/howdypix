import { EventEmitter } from "events";
import { Connection } from "typeorm";
import Memory from "lowdb/adapters/Memory";
import { Album, Photo, Source } from "../src/datastore/database/entity";
import { createAppStore, initializeStore } from "../src/datastore/state";
import { initializeDatabase } from "../src/datastore/database/initialize";
import { initializeLowDb } from "../src/datastore/lowdb";
import {
  generateSource,
  generateAlbum,
  generatePhoto,
} from "../src/lib/testUtils";
import { startCacheDB } from "../src/services";
import { UserConfig } from "../src/lib/config";

export const resetValues = (): {
  sources: Source[];
  albums: Album[];
  photos: Photo[];
} => {
  const sources = [generateSource(0), generateSource(1), generateSource(2)];
  const albums = [
    generateAlbum(0, sources[0]),
    generateAlbum(1, sources[0]),
    generateAlbum(2, sources[0]),
    generateAlbum(3, sources[1]),
  ];
  albums[2].parentDir = albums[1].dir;

  const photos = [
    generatePhoto(0, albums[0], { make: "make1", model: "model1" }),
    generatePhoto(1, albums[0], { make: "make2", model: "model2" }),
    generatePhoto(2, albums[0], { make: "make2", model: "model1" }),
    generatePhoto(3, albums[0], { make: "make1", model: "model1" }),
    generatePhoto(4, albums[0], { make: "make2", model: "model2" }),
    generatePhoto(5, albums[0], { make: "make2", model: "model1" }),
    generatePhoto(6, albums[0], { make: "make1", model: "model1" }),
    generatePhoto(7, albums[0], { make: "make2", model: "model2" }),
    generatePhoto(8, albums[0], { make: "make2", model: "model1" }),
    generatePhoto(9, albums[1]),
    generatePhoto(10, null, {
      source: sources[0].source,
    }),
    generatePhoto(11, null, {
      source: sources[0].source,
    }),
    generatePhoto(12, albums[2], {
      parentDir: albums[1].dir,
    }),
  ];

  return { sources, albums, photos };
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const initialize = () => {
  const baseUserConfig: UserConfig = {
    photoDirs: {
      first: "./first",
      second: "./second",
    },
    thumbnailsDir: "/thumbnailsDir",
    users: [],
    emailSender: {
      email: "email@sender.com",
      name: "Sender",
    },
  };

  const store = createAppStore();
  const statedb = initializeLowDb(Memory);
  const event = new EventEmitter();
  const connection = initializeDatabase({ path: ":memory:" }, store, event);

  const saveAllData = (
    connection: Connection,
    {
      sources,
      albums,
      photos,
    }: {
      sources: Source[];
      albums: Album[];
      photos: Photo[];
    }
  ): Promise<void> =>
    Promise.all(
      sources.map((source) => connection.getRepository(Source).save(source))
    )
      .then(() =>
        Promise.all(
          albums.map((album) => connection.getRepository(Album).save(album))
        )
      )
      .then(() =>
        Promise.all(
          photos.map((photo) => connection.getRepository(Photo).save(photo))
        )
      )
      .then(() => initializeStore(store, connection, statedb));

  return {
    connection,
    statedb,
    store,
    saveAllData,
    reset: async (): Promise<void> => {
      // Reset the listeners
      event.removeAllListeners();

      // Reset the database
      if (connection.isConnected) {
        await connection.close();
      }

      await statedb
        .setState({ albums: {}, searches: {}, searchAlbumRelation: [] })
        .write();
      await connection.connect();

      await startCacheDB(event, baseUserConfig, connection);
    },
  };
};
