import { statSync } from "fs";
import { appError } from "@howdypix/utils";
import { startCacheDB } from "../src/services/startCacheDB";
import { Events } from "../src/lib/eventEmitter";
import { initialize } from "./scanFiles.setup";

jest.mock("@howdypix/utils", () => ({
  ...jest.requireActual("@howdypix/utils"),
  appError: jest.fn(),
}));

jest.mock("fs", (): { [name: string]: jest.Mock } => ({
  ...jest.requireActual("fs"),
  statSync: jest.fn(),
}));

describe("[Start] Scanning files", (): void => {
  let events: Events;

  const {
    pathHashCode,
    baseUserConfig,
    assertDatabaseValue,
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
    }
  );

  // ===================================================
  // Tests
  // ===================================================
  describe("when starting the process", (): void => {
    test("should add a new source entry", async (): Promise<void> => {
      await startCacheDB(events, baseUserConfig, connection);

      // Test if the album entries have been created
      assertDatabaseValue();
    });

    test("should display an error if one source does not have the directory accessible but the other yes", async (): Promise<
      void
    > => {
      (statSync as jest.Mock).mockImplementation((name) => {
        if (/first$/.exec(name)) {
          throw new Error("ENOENT: no such file or directory, stat '/first'");
        } else {
          return {
            ino: pathHashCode(name),
          };
        }
      });

      await startCacheDB(events, baseUserConfig, connection);

      // Test if the album entries have been created
      expect(appError).toHaveBeenCalled();
      assertDatabaseValue();
    });
  });
});
