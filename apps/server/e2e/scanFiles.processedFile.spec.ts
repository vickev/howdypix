import waitForExpect from "wait-for-expect";
import { statSync } from "fs";
import { ProcessData } from "@howdypix/shared-types";
import { appError } from "@howdypix/utils";
import { startCacheDB } from "../src/lib/startCacheDB";
import { Events } from "../src/lib/eventEmitter";
import { initialize } from "./scanFiles.setup";
import { Photo } from "../src/entity";

jest.mock("@howdypix/utils", () => ({
  ...jest.requireActual("@howdypix/utils"),
  appError: jest.fn(),
}));

jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  statSync: jest.fn(),
}));

describe("[ProcessedFile] Scanning files", (): void => {
  let events: Events;

  const dir = "album";
  const file = "PHOTO.jpg";

  const baseProcessedFile: ProcessData = {
    hfile: {
      dir,
      file,
      source: "first",
    },
    root: "/root",
    exif: {
      aperture: 0.1,
      createDate: 1,
      ISO: 2000,
      make: "Make",
      model: "Model",
      shutter: 0.23,
    },
    stat: {
      birthtime: 2,
      ctime: 3,
      mtime: 4,
      size: 5,
      inode: 1234,
    },
    thumbnails: ["thumb1", "thumb2", "thumb3"],
  };

  const {
    pathHashCode,
    baseUserConfig,
    retrieveAlbums,
    retrievePhotos,
    resetScanFilesTests,
    connection,
  } = initialize();

  // ===================================================
  // Reset after each tests
  // ===================================================
  beforeEach(
    async (): Promise<void> => {
      jest.resetAllMocks();
      jest.restoreAllMocks();

      const setup = await resetScanFilesTests();
      events = setup.events;

      (statSync as jest.Mock).mockImplementation((name: string) => ({
        ino: pathHashCode(name),
        mtime: new Date(1),
        ctime: new Date(2),
        birthtime: new Date(3),
        size: 10,
      }));

      await startCacheDB(events, baseUserConfig, connection);

      // 1. Add a photo
      events.emit("newFile", {
        hfile: {
          dir,
          file,
          source: "first",
        },
        root: "/root",
      });

      await waitForExpect(
        async (): Promise<void> => {
          // eslint-disable-next-line jest/no-standalone-expect
          expect(await retrieveAlbums()).toHaveLength(3);
          // eslint-disable-next-line jest/no-standalone-expect
          expect(await retrievePhotos()).toHaveLength(1);
        }
      );
    }
  );

  test("should update the entry", async (): Promise<void> => {
    jest.spyOn(connection.getRepository(Photo), "save");

    events.emit("processedFile", baseProcessedFile);

    await waitForExpect(
      async (): Promise<void> => {
        expect(connection.getRepository(Photo).save).toHaveBeenCalled();
      }
    );

    expect(await retrievePhotos()).toMatchSnapshot();
  });

  test("should NOT update if the photo is not in the DB", async (): Promise<
    void
  > => {
    jest.spyOn(connection.getRepository(Photo), "save");

    events.emit("processedFile", {
      ...baseProcessedFile,
      hfile: { ...baseProcessedFile.hfile, file: "DOES NOT EXIST" },
    });

    await waitForExpect(
      async (): Promise<void> => {
        expect(appError).toHaveBeenCalled();
      }
    );

    expect(connection.getRepository(Photo).save).not.toHaveBeenCalled();
  });

  test("should NOT update if the album is not in the DB", async (): Promise<
    void
  > => {
    jest.spyOn(connection.getRepository(Photo), "save");

    events.emit("processedFile", {
      ...baseProcessedFile,
      hfile: { ...baseProcessedFile.hfile, dir: "DOES NOT EXIST" },
    });

    await waitForExpect(
      async (): Promise<void> => {
        expect(appError).toHaveBeenCalled();
      }
    );

    expect(connection.getRepository(Photo).save).not.toHaveBeenCalled();
  });
});
