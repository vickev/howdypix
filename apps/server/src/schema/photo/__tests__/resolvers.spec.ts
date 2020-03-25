import { Connection } from "typeorm";
import { getPhotoResolver } from "../photoResolvers";
import { Photo as EntityPhoto } from "../../../entity/Photo";
import { photoHelpers } from "../../../helpers/photoHelpers";
import { SearchResult as EntitySearchResult } from "../../../entity/SearchResult";

describe("getPhotoResolver", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    photoHelpers.fetchPhotoSteam = jest.fn();
  });

  const resolver = getPhotoResolver();

  test("should return the detail of one picture", async () => {
    const connection = ({
      getRepository: () => ({
        findOne: (): EntityPhoto => ({
          file: "file",
          dir: "dir",
          source: "source",
          birthtime: 123,
          createDate: 456,
          ctime: 789,
          id: 123456789,
          inode: 249508340,
          ISO: 348095,
          make: "make",
          model: "model",
          mtime: 124323423,
          parentDir: "parent",
          size: 123123,
          searchResults: [],
          processedAperture: 4,
          aperture: 4,
          shutter: 1 / 40,
          processedShutter: 40,
        }),
      }),
    } as unknown) as Connection;

    (photoHelpers.fetchPhotoSteam as jest.Mock).mockReturnValue([
      {
        id: 1,
        order: 0,
        photoId: 345,
        searchId: 678,
        photo: {
          id: 345,
          file: "file1",
        },
      },
      {
        id: 12,
        order: 1,
        photoId: 123456789,
        searchId: 6782,
        photo: {
          id: 123456789,
          file: "file2",
        },
      },
      {
        id: 123,
        order: 2,
        photoId: 3453,
        searchId: 6783,
        photo: {
          id: 3453,
          file: "file3",
        },
      },
    ] as EntitySearchResult[]);

    expect(
      await resolver(
        {},
        { file: "file", album: "album", source: "source" },
        { user: null, connection }
      )
    ).toMatchSnapshot();
  });

  test("should return null if no pictures have been found", async () => {
    const connection = ({
      getRepository: () => ({
        findOne: (): null => null,
      }),
    } as unknown) as Connection;

    expect(
      await resolver(
        {},
        { file: "file", album: "album", source: "source" },
        { user: null, connection }
      )
    ).toMatchSnapshot();
  });
});
