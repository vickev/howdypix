import { Connection } from "typeorm";
import { getSourcesResolver } from "../sourceResolvers";
import { UserConfig } from "../../../config";
import { Source as EntitySource } from "../../../entity/Source";

describe("currentUserResolver", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const photoDirs: UserConfig["photoDirs"] = {
    source1: "source1",
    source2: "source2",
    source3: "source3",
  };

  const resolver = getSourcesResolver(photoDirs);

  const connection = ({
    getRepository: () => ({
      find: (): EntitySource[] => [
        {
          id: 1,
          source: "source1",
          dir: "dir1",
          albums: [],
          getNbAlbums: async (): Promise<number> => 1,
          getNbPhotos: async (): Promise<number> => 10,
          getPreview: async (): Promise<{ dir: string; file: string }> => ({
            dir: "dir1",
            file: "preview1.png",
          }),
        },
        {
          id: 2,
          source: "source2",
          dir: "dir2",
          albums: [],
          getNbAlbums: async (): Promise<number> => 2,
          getNbPhotos: async (): Promise<number> => 20,
          getPreview: async (): Promise<{ dir: string; file: string }> => ({
            dir: "dir2",
            file: "preview2.png",
          }),
        },
      ],
    }),
  } as unknown) as Connection;

  test("should return the current list of sources", async () => {
    expect(
      await resolver({}, { source: "source1" }, { user: null, connection })
    ).toMatchSnapshot();
  });
});
