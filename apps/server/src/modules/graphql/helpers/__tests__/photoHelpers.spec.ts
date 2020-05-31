import { Connection } from "typeorm";
import { searchHelpers } from "../searchHelpers";
import { photoHelpers } from "../photoHelpers";
import {
  Album,
  Photo as EntityPhoto,
  PHOTO_STATUS,
} from "../../../../datastore/database/entity";

describe("photoHelpers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const callFetchPhotoSteam = async (order: number): Promise<void> => {
    const connection = ({
      getRepository: jest.fn(() => ({
        findOne: jest.fn(() => ({ order })),
      })),
    } as unknown) as Connection;

    searchHelpers.findSavedSearch = jest.fn();
    searchHelpers.doSearchWithCache = jest.fn();

    const photo: EntityPhoto = {
      id: 123,
      updatedAt: new Date(0),
      createdAt: new Date(0),
      file: "file",
      source: "source",
      dir: "dir",
      birthtime: 123,
      createDate: 123,
      ctime: 123,
      inode: 1243,
      ISO: 14231,
      make: "make",
      model: "model",
      mtime: 123414,
      parentDir: "",
      size: 3434,
      searchResults: [],
      processedAperture: 4,
      aperture: 4,
      shutter: 1 / 40,
      processedShutter: 40,
      status: PHOTO_STATUS.PROCESSED,
      album: new Album(),
      albumId: 1,
    };

    await photoHelpers.fetchPhotoSteam(connection, photo, {
      album: "album",
      file: "file",
      filterBy: {},
      orderBy: "DATE_ASC",
      source: "source",
    });
  };

  test("fetchPhotoSteam should return the photo stream when first image.", async () => {
    await callFetchPhotoSteam(0);

    expect(searchHelpers.doSearchWithCache).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      0,
      6
    );
  });

  test("fetchPhotoSteam should return the photo stream when middle image.", async () => {
    await callFetchPhotoSteam(7);

    expect(searchHelpers.doSearchWithCache).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      4,
      6
    );
  });
});
