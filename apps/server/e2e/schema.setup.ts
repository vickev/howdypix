import { EntitySchema, getConnectionManager, Connection } from "typeorm";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
// @ts-ignore
import ormConfig from "../ormconfig";
import { Album, Photo, PHOTO_STATUS, Source } from "../src/entity";
import * as entities from "../src/entity";

export const generateSource = (
  id: number,
  overrides: Partial<Source> = {}
): Source => {
  const source = new Source();

  source.id = id;
  source.source = `source${id}`;
  source.dir = `sourceDir${id}`;

  Object.keys(overrides).forEach((key) => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    source[key] = overrides[key];
  });

  return source;
};

export const generateAlbum = (
  id: number,
  source: Source,
  overrides: Partial<Album> = {}
): Album => {
  const album = new Album();

  album.id = id;
  album.inode = `albumInode${id}`;
  album.dir = `albumDir${id}`;
  album.parentDir = `albumParentDir${id}`;
  album.sourceLk = source;
  album.source = source.source;

  Object.keys(overrides).forEach((key) => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    album[key] = overrides[key];
  });

  return album;
};

export const generatePhoto = (
  id: number,
  album: Album | null = null,
  overrides: Partial<Photo> = {}
): Photo => {
  const photo = new Photo();

  photo.id = id;
  photo.inode = parseInt(`10000${id}`, 0);
  photo.file = `File${id}`;
  photo.dir = album?.dir ?? "";
  photo.parentDir = album?.parentDir ?? "";
  if (album) {
    photo.album = album;
  }
  photo.source = album?.source ?? "";
  photo.status = PHOTO_STATUS.PROCESSED;
  photo.aperture = parseInt(`1111${id}`, 0);
  photo.ISO = parseInt(`2222${id}`, 0);
  photo.shutter = parseInt(`3333${id}`, 0);
  photo.size = parseInt(`4444${id}`, 0);
  photo.birthtime = new Date(parseInt(`00${id}`, 0)).getMilliseconds();
  photo.ctime = new Date(parseInt(`11${id}`, 0)).getMilliseconds();
  photo.mtime = new Date(parseInt(`22${id}`, 0)).getMilliseconds();
  photo.createDate = new Date(parseInt(`33${id}`, 0)).getMilliseconds();
  photo.make = `make${id}`;
  photo.model = `model${id}`;

  Object.keys(overrides).forEach((key) => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    photo[key] = overrides[key];
  });

  return photo;
};

export const saveAllData = (
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
    .then(() => {});

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
  const connectionManager = getConnectionManager();
  const connection = connectionManager.create({
    ...(ormConfig as SqliteConnectionOptions),
    database: ":memory:",
    entities: Object.keys(entities).map(
      (e): EntitySchema =>
        ((entities as unknown) as { [key: string]: EntitySchema })[e]
    ),
  });

  return {
    connection,
    reset: async (): Promise<void> => {
      // Reset the database
      if (connection.isConnected) {
        await connection.close();
      }

      await connection.connect();
    },
  };
};
