import { statSync } from "fs";
import { appError } from "@howdypix/utils";
import waitForExpect from "wait-for-expect";
import { startCacheDB } from "../src/services/startCacheDB";
import { Album, Photo } from "../src/datastore/database/entity";
import { Events, EventTypes } from "../src/lib/eventEmitter";
import { initialize } from "./scanFiles.setup";

jest.mock("@howdypix/utils", () => ({
  ...jest.requireActual("@howdypix/utils"),
  appError: jest.fn(),
}));

jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  statSync: jest.fn(),
}));

describe("[NewFile] Scanning files", (): void => {
  let events: Events;

  const {
    pathHashCode,
    baseUserConfig,
    retrievePhotos,
    retrieveAlbums,
    resetScanFilesTests,
    connection,
  } = initialize();

  const executeTest = async (
    eventParams: EventTypes["newFile"],
    expectedAlbumLen: number
  ): Promise<void> => {
    await Promise.all([
      // SHOULD SEND AN EVENT
      new Promise((resolve, reject): void => {
        events.once("processFile", (params): void => {
          try {
            expect(params).toMatchSnapshot();
            resolve();
          } catch (e) {
            reject(e);
          }
        });

        events.emit("newFile", eventParams);
      }),
      // SHOULD SAVE IN THE DATABASE
      await waitForExpect(
        async (): Promise<void> => {
          const photos = await retrievePhotos();
          const albums = await retrieveAlbums();

          expect(photos.length).toEqual(1);
          expect(photos).toMatchSnapshot();

          expect(albums.length).toEqual(expectedAlbumLen);
          expect(albums).toMatchSnapshot();
        }
      ),
    ]);
  };

  // ===================================================
  // Reset after each tests
  // ===================================================
  beforeEach(
    async (): Promise<void> => {
      jest.resetAllMocks();
      jest.restoreAllMocks();

      const setup = await resetScanFilesTests();
      events = setup.events;

      jest.spyOn(connection.getRepository(Photo), "save");
      jest.spyOn(Album, "insertIfDoesntExist");
      jest.spyOn(events, "emit");

      (statSync as jest.Mock).mockImplementation((name) => ({
        ino: pathHashCode(name),
        mtime: new Date(1),
        ctime: new Date(2),
        birthtime: new Date(3),
        size: 10,
      }));

      await startCacheDB(events, baseUserConfig, connection);
    }
  );

  test("should save a new entry and emit an event - album file", async (): Promise<
    void
  > =>
    executeTest(
      {
        root: "/home/lelouch/first",
        hfile: {
          source: "first",
          file: "PHOTO1.jpg",
          dir: "myAlbum",
        },
      },
      3
    ));

  test("should save a new entry and emit an event - sub-album file", async (): Promise<
    void
  > =>
    executeTest(
      {
        root: "/home/lelouch/first",
        hfile: {
          source: "first",
          file: "PHOTO1.jpg",
          dir: "myAlbum/mySubAlbum",
        },
      },
      3
    ));

  test("should save a new entry and emit an event - root file", async () =>
    executeTest(
      {
        root: "/home/lelouch/first",
        hfile: {
          source: "first",
          file: "PHOTO1.jpg",
          dir: "",
        },
      },
      2
    ));

  test("should not save anything if we cannot have the album information to link", async (): Promise<
    void
  > => {
    jest
      .spyOn(Album, "insertIfDoesntExist")
      .mockImplementation(async (): Promise<null> => null);

    // jest.spyOn(events, "emit");

    events.emit("newFile", {
      root: "/home/lelouch/first",
      hfile: {
        source: "first",
        file: "PHOTO1.jpg",
        dir: "",
      },
    });

    // SHOULD NOT SAVE IN THE DATABASE
    await waitForExpect((): void => {
      expect(appError).toHaveBeenCalled();
    });

    expect(await retrievePhotos()).toHaveLength(0);
    expect(await retrieveAlbums()).toHaveLength(2);
    expect(events.emit).toHaveBeenCalledTimes(1);
  });

  test("should only send event if the photo already exists in the DB", async (): Promise<
    void
  > => {
    const params: EventTypes["newFile"] = {
      root: "/home/lelouch/first",
      hfile: {
        source: "first",
        file: "PHOTO1.jpg",
        dir: "",
      },
    };

    await new Promise((resolve, reject): void => {
      events.once("processFile", (): void => {
        try {
          expect(appError).not.toHaveBeenCalled();

          (connection.getRepository(Photo).save as jest.Mock).mockClear();

          events.once("processFile", (): void => {
            try {
              expect(appError).not.toHaveBeenCalled();
              expect(
                connection.getRepository(Photo).save
              ).not.toHaveBeenCalled();
              resolve();
            } catch (e) {
              reject(e);
            }
          });

          // Emit a second time with the same file => should not save anything in the DB
          events.emit("newFile", params);
        } catch (e) {
          reject(e);
        }
      });

      events.emit("newFile", params);
    });
  });

  test("should fail gracefully", async (): Promise<void> => {
    (statSync as jest.Mock).mockImplementation((): void => {
      throw new Error("ENOT");
    });

    // jest.spyOn(events, "emit");

    events.emit("newFile", {
      root: "/home/lelouch/first",
      hfile: {
        source: "first",
        file: "PHOTO1.jpg",
        dir: "",
      },
    });

    await waitForExpect((): void => {
      expect(appError).toHaveBeenCalled();
    });

    expect(events.emit).toHaveBeenCalledTimes(1);
  });
});
