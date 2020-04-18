import { appError } from "@howdypix/utils";
import waitForExpect from "wait-for-expect";
import { startCacheDB } from "../src/lib/startCacheDB";
import { Album, Photo } from "../src/entity";
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

describe("[NewFolder] Scanning files", (): void => {
  let events: Events;

  const {
    baseUserConfig,
    retrieveAlbums,
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

      jest.spyOn(connection.getRepository(Photo), "save");
      jest.spyOn(Album, "insertIfDoesntExist");
      jest.spyOn(events, "emit");

      await startCacheDB(events, baseUserConfig, connection);

      (Album.insertIfDoesntExist as jest.Mock).mockClear();
    }
  );

  const executeTest = async (dir: string): Promise<void> => {
    events.emit("newDirectory", {
      hfile: {
        dir,
        file: "newAlbum",
        source: "first",
      },
      root: "/root",
    });

    await waitForExpect(
      async (): Promise<void> => {
        expect(await retrieveAlbums()).toHaveLength(3);
      }
    );

    expect(await retrieveAlbums()).toMatchSnapshot();
  };

  test("should save a new entry - root", async (): Promise<void> =>
    executeTest(""));

  test("should save a new entry - sub-album", async (): Promise<void> =>
    executeTest("album"));

  test("should save a new entry - sub-sub-album", async (): Promise<void> =>
    executeTest("album1/album2/album3/album4"));

  test("should not save if the source is missing in the DB", async (): Promise<
    void
  > => {
    events.emit("newDirectory", {
      hfile: {
        dir: "",
        file: "newAlbum",
        source: "doesnotexist",
      },
      root: "/root",
    });

    await waitForExpect(
      async (): Promise<void> => {
        expect(appError).toHaveBeenCalled();
      }
    );

    expect(await retrieveAlbums()).toHaveLength(2);
  });
});
