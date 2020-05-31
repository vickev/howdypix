import { join } from "path";
// eslint-disable-next-line import/no-extraneous-dependencies
import waitForExpect from "wait-for-expect";
import { statSync } from "fs";
import { startCacheDB } from "../src/services/startCacheDB";
// @ts-ignore
import { Events } from "../src/lib/eventEmitter";
import { initialize } from "./scanFiles.setup";

jest.mock(
  "@howdypix/utils",
  () =>
    ({
      ...jest.requireActual("@howdypix/utils"),
      appError: jest.fn(),
    } as Record<string, Function>)
);

jest.mock(
  "fs",
  () =>
    ({
      ...jest.requireActual("fs"),
      statSync: jest.fn(),
    } as Record<string, Function>)
);

describe("[DeleteFolder] Scanning files", () => {
  let events: Events;

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
  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const setup = await resetScanFilesTests();
    events = setup.events;

    (statSync as jest.Mock).mockImplementation((name) => ({
      ino: pathHashCode(name),
      mtime: new Date(1),
      ctime: new Date(2),
      birthtime: new Date(3),
      size: 10,
    }));

    await startCacheDB(events, baseUserConfig, connection);
  });

  test("should remove the entry", async () => {
    const dir = "test";
    const file = "newAlbum";

    // 1. Create a new directory
    events.emit("newDirectory", {
      hfile: {
        dir,
        file,
        source: "first",
      },
      root: "/root",
    });

    await waitForExpect(async () => {
      expect(await retrieveAlbums()).toHaveLength(3);
    });

    // 2. Remove a directory
    events.emit("unlinkDirectory", {
      hfile: {
        // weird:
        file: join(dir, file),
        dir,
        source: "first",
      },
      root: "/root",
    });

    await waitForExpect(async () => {
      expect(await retrieveAlbums()).toHaveLength(2);
    });
  });

  test("should remove the linked photos", async (): Promise<void> => {
    const dir = "test";
    const file = "newAlbum";

    // 1. Create a new directory
    events.emit("newDirectory", {
      hfile: {
        dir,
        file,
        source: "first",
      },
      root: "/root",
    });

    await waitForExpect(
      async (): Promise<void> => {
        expect(await retrieveAlbums()).toHaveLength(3);
      }
    );

    // 2. Add a photo
    events.emit("newFile", {
      hfile: {
        dir: join(dir, file),
        file: "PHOTO.jpg",
        source: "first",
      },
      root: "/root",
    });

    await waitForExpect(
      async (): Promise<void> => {
        expect(await retrieveAlbums()).toHaveLength(3);
        expect(await retrievePhotos()).toHaveLength(1);
      }
    );

    // 3. Remove a directory
    events.emit("unlinkDirectory", {
      hfile: {
        // weird:
        file: join(dir, file),
        dir,
        source: "first",
      },
      root: "/root",
    });

    await waitForExpect(
      async (): Promise<void> => {
        expect(await retrieveAlbums()).toHaveLength(2);
        expect(await retrievePhotos()).toHaveLength(0);
      }
    );
  });
});
