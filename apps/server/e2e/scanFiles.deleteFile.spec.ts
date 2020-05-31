import waitForExpect from "wait-for-expect";
import { statSync } from "fs";
import { startCacheDB } from "../src/services/startCacheDB";
import { Events } from "../src/lib/eventEmitter";
import { initialize } from "./scanFiles.setup";

jest.mock("@howdypix/utils", () => ({
  ...jest.requireActual("@howdypix/utils"),
  appError: jest.fn(),
}));

jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  statSync: jest.fn(),
}));

describe("[DeleteFile] Scanning files", (): void => {
  let events: Events;

  const {
    pathHashCode,
    baseUserConfig,
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

  test("should remove the entry", async (): Promise<void> => {
    const dir = "test/newAlbum";
    const file = "PHOTO.jpg";

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
        expect(await retrievePhotos()).toHaveLength(1);
      }
    );

    // 2. Remove the photo
    events.emit("removeFile", {
      hfile: {
        file,
        dir,
        source: "first",
      },
      root: "/root",
    });

    await waitForExpect(
      async (): Promise<void> => {
        expect(await retrievePhotos()).toHaveLength(0);
      }
    );
  });
});
