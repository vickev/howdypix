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
          source: "source1",
          nbAlbums: 1,
          nbPhotos: 10,
          preview: "preview1.png",
          dir: "dir1",
        },
        {
          source: "source2",
          nbAlbums: 2,
          nbPhotos: 20,
          preview: "preview2.png",
          dir: "dir2",
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
