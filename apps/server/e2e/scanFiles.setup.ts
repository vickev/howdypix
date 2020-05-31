import { EventEmitter } from "events";
import { statSync } from "fs";
import { omit } from "lodash";
import { appError } from "@howdypix/utils";
// eslint-disable-next-line import/no-extraneous-dependencies
import { EntitySchema, getConnectionManager } from "typeorm";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { parse } from "path";
// @ts-ignore
import ormConfig from "../ormconfig";
import * as entities from "../src/datastore/database/entity";
import { Album, Photo, Source } from "../src/datastore/database/entity";
import { UserConfig } from "../src/lib/config";
import { mockDate } from "../src/lib/testUtils";

jest.mock(
  "@howdypix/utils",
  () =>
    ({
      ...jest.requireActual("@howdypix/utils"),
      appError: jest.fn(),
    } as Record<string, any>)
);

jest.mock(
  "fs",
  () =>
    ({
      ...jest.requireActual("fs"),
      statSync: jest.fn(),
    } as Record<string, any>)
);

export function initialize(): {
  pathHashCode: typeof pathHashCode;
  connection: typeof connection;
  baseUserConfig: typeof baseUserConfig;
  retrievePhotos: typeof retrievePhotos;
  retrieveAlbums: typeof retrieveAlbums;
  retrieveSources: typeof retrieveSources;
  assertDatabaseValue: typeof assertDatabaseValue;
  resetScanFilesTests: typeof resetScanFilesTests;
} {
  const pathHashCode = (name: string): string =>
    Buffer.from(parse(parse(name).dir).base + parse(name).base).toString(
      "base64"
    );

  const connectionManager = getConnectionManager();
  const connection = connectionManager.create({
    ...(ormConfig as SqliteConnectionOptions),
    database: ":memory:",
    entities: Object.keys(entities).map(
      (e): EntitySchema =>
        ((entities as unknown) as { [key: string]: EntitySchema })[e]
    ),
  });

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

  const retrievePhotos = async (): Promise<Photo[]> =>
    connection
      .getRepository(Photo)
      .find({ relations: ["album"], order: { inode: "ASC" } })
      .then((value) =>
        value.map((v) => ({
          id: 1,
          ...omit(v, "id"),
          album: { id: 1, ...omit(v.album, "id") },
        }))
      );
  const retrieveAlbums = async (): Promise<Album[]> =>
    connection
      .getRepository(Album)
      .find({ relations: ["sourceLk", "photos"], order: { inode: "ASC" } })
      .then((value) =>
        value.map((v) => ({
          id: 1,
          ...omit(v, ["id"]),
          sourceLk: { id: 1, ...omit(v.sourceLk, "id") },
          photos: v.photos
            .map((p) => ({ id: 1, ...omit(p, "id") }))
            .sort((p1, p2) => (p1.inode < p2.inode ? 1 : -1)),
        }))
      );
  const retrieveSources = async (): Promise<Source[]> =>
    connection
      .getRepository(Source)
      .find({ relations: ["albums"], order: { source: "ASC" } })
      .then((value) =>
        value.map((v) => ({
          id: 1,
          ...omit(v, "id"),
          albums: v.albums
            .map((a) => ({ id: 1, ...omit(a, "id") }))
            .sort((p1, p2) => (p1.inode < p2.inode ? 1 : -1)),
        }))
      );

  const assertDatabaseValue = async (): Promise<void> => {
    expect(await retrieveAlbums()).toMatchSnapshot();
    expect(await retrieveSources()).toMatchSnapshot();
  };

  const resetScanFilesTests = async (): Promise<{
    events: EventEmitter;
  }> => {
    (statSync as jest.Mock).mockImplementation((name): { ino: string } => ({
      ino: pathHashCode(name),
    }));

    (appError as jest.Mock).mockReturnValue((): void => {});

    // Mock Date
    mockDate();

    // Reset the database
    if (connection.isConnected) {
      await connection.close();
    }

    await connection.connect();

    // Create another event emitter
    return { events: new EventEmitter() };
  };

  return {
    pathHashCode,
    connection,
    baseUserConfig,
    retrievePhotos,
    retrieveAlbums,
    retrieveSources,
    assertDatabaseValue,
    resetScanFilesTests,
  };
}
