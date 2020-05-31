import { appError } from "@howdypix/utils";
import { onNewDir } from "../startCacheDB";
import { Source, Album } from "../../datastore/database/entity";

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock("@howdypix/utils", (): { [name: string]: jest.Mock } => ({
  ...jest.requireActual("@howdypix/utils"),
  appError: jest.fn(),
}));

describe("onNewDir", (): void => {
  beforeEach((): void => {
    jest.resetAllMocks();

    (appError as jest.Mock).mockReturnValue((): void => {});
  });

  test("should send an error if the source does not exist", async (): Promise<
    void
  > => {
    // @ts-ignore
    Source.fetchOne = jest.fn(null);
    // @ts-ignore
    Album.insertIfDoesntExist = jest.fn();

    await onNewDir({
      hfile: { file: "file", source: "source", dir: "dir" },
      root: "/root",
    });

    expect(appError).toHaveBeenCalled();
    expect(Album.insertIfDoesntExist).not.toHaveBeenCalled();
  });

  test("should save the album", async (): Promise<void> => {
    // @ts-ignore
    Source.fetchOne = jest.fn((): object => ({ id: 1 }));
    // @ts-ignore
    Album.insertIfDoesntExist = jest.fn();

    await onNewDir({
      hfile: { file: "file", source: "source", dir: "dir" },
      root: "/root",
    });

    expect(appError).not.toHaveBeenCalled();
    expect(
      (Album.insertIfDoesntExist as jest.Mock).mock.calls[0]
    ).toMatchSnapshot();
  });
});
