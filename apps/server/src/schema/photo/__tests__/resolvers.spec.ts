import { Connection } from "typeorm";
import { getPhotoResolver } from "../photoResolvers";
import { Photo as EntityPhoto } from "../../../entity/Photo";

describe("getPhotoResolver", () => {
  beforeEach(() => {
    jest.resetAllMocks();
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
          size: 123123
        })
      })
    } as unknown) as Connection;

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
        findOne: (): null => null
      })
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
