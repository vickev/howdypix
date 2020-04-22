import { EntitySchema, getConnectionManager, Connection } from "typeorm";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { NexusGenArgTypes } from "@howdypix/graphql-schema/schema.d";
import * as entities from "../src/entity";
import { Album, Photo, PHOTO_STATUS, Source } from "../src/entity";
// @ts-ignore
import ormConfig from "../ormconfig";
import { getSearchResolver } from "../src/schema/search/searchResolvers";

const generateSource = (
  id: number,
  overrides: Partial<Source> = {}
): Source => {
  const source = new Source();

  source.id = id;
  source.source = `source${id}`;
  source.dir = `sourceDir${id}`;

  Object.keys(overrides).forEach((key) => {
    source[key] = overrides[key];
  });

  return source;
};

const generateAlbum = (
  id: number,
  source: Source,
  overrides: Partial<Album> = {}
): Album => {
  const album = new Album();

  album.id = id;
  album.inode = `albumInode${id}`;
  album.dir = `albumDir${id}`;
  album.parentDir = `albumParentDir${id}`;
  album.sourceLk = source;
  album.source = source.source;

  Object.keys(overrides).forEach((key) => {
    album[key] = overrides[key];
  });

  return album;
};

const generatePhoto = (
  id: number,
  album: Album | null = null,
  overrides: Partial<Photo> = {}
): Photo => {
  const photo = new Photo();

  photo.id = id;
  photo.inode = parseInt(`10000${id}`, 0);
  photo.file = `File${id}`;
  photo.dir = album?.dir ?? "";
  photo.parentDir = album?.parentDir ?? "";
  photo.album = album;
  photo.source = album?.source ?? "";
  photo.status = PHOTO_STATUS.PROCESSED;
  photo.aperture = parseInt(`1111${id}`, 0);
  photo.ISO = parseInt(`2222${id}`, 0);
  photo.shutter = parseInt(`3333${id}`, 0);
  photo.size = parseInt(`4444${id}`, 0);
  photo.birthtime = new Date(parseInt(`00${id}`, 0)).getMilliseconds();
  photo.ctime = new Date(parseInt(`11${id}`, 0)).getMilliseconds();
  photo.mtime = new Date(parseInt(`22${id}`, 0)).getMilliseconds();
  photo.createDate = new Date(parseInt(`33${id}`, 0)).getMilliseconds();
  photo.make = `make${id}`;
  photo.model = `model${id}`;

  Object.keys(overrides).forEach((key) => {
    photo[key] = overrides[key];
  });

  return photo;
};

const saveAllData = (
  connection: Connection,
  {
    sources,
    albums,
    photos,
  }: {
    sources: Source[];
    albums: Album[];
    photos: Photo[];
  }
): Promise<void> =>
  Promise.all(
    sources.map((source) => connection.getRepository(Source).save(source))
  )
    .then(() =>
      Promise.all(
        albums.map((album) => connection.getRepository(Album).save(album))
      )
    )
    .then(() =>
      Promise.all(
        photos.map((photo) => connection.getRepository(Photo).save(photo))
      )
    )
    .then(() => {});

describe("search resolver", () => {
  const connectionManager = getConnectionManager();
  const connection = connectionManager.create({
    ...(ormConfig as SqliteConnectionOptions),
    database: ":memory:",
    entities: Object.keys(entities).map(
      (e): EntitySchema =>
        ((entities as unknown) as { [key: string]: EntitySchema })[e]
    ),
  });

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    // Reset the database
    if (connection.isConnected) {
      await connection.close();
    }

    await connection.connect();
  });

  describe("with a full database", () => {
    let sources: Source[];
    let albums: Album[];
    let photos: Photo[];

    const resetValues = (): void => {
      sources = [generateSource(0), generateSource(1), generateSource(2)];
      albums = [
        generateAlbum(0, sources[0]),
        generateAlbum(1, sources[0]),
        generateAlbum(2, sources[0]),
        generateAlbum(3, sources[1]),
      ];
      albums[2].parentDir = albums[1].dir;

      photos = [
        generatePhoto(0, albums[0], { make: "make1", model: "model1" }),
        generatePhoto(1, albums[0], { make: "make2", model: "model2" }),
        generatePhoto(2, albums[0], { make: "make2", model: "model1" }),
        generatePhoto(3, albums[1]),
        generatePhoto(4, null, {
          source: sources[0].source,
        }),
        generatePhoto(5, null, {
          source: sources[0].source,
        }),
        generatePhoto(6, albums[2], {
          parentDir: albums[1].dir,
        }),
      ];
    };

    resetValues();

    beforeEach(() => {
      resetValues();
    });

    const tests: [string, NexusGenArgTypes["Query"]["getSearch"]][] = [
      [
        "should return photos at the root with result",
        { album: "", source: sources[0].source },
      ],
      [
        "should return photos at the root without result",
        { album: "", source: sources[1].source },
      ],
      [
        "should return photos in an album with results",
        { album: photos[0].dir, source: photos[0].source },
      ],
      [
        "should return photos in an sub-album with results",
        { album: photos[6].dir, source: photos[6].source },
      ],
      [
        "should return photos with matching filters",
        {
          album: photos[0].dir,
          source: photos[0].source,
          filterBy: { make: ["make1"] },
        },
      ],
      [
        "should return photos with multiple matching filters",
        {
          album: photos[0].dir,
          source: photos[0].source,
          filterBy: { make: ["make1", "make2"] },
        },
      ],
      [
        "should return photos with different filters",
        {
          album: photos[0].dir,
          source: photos[0].source,
          filterBy: { make: ["make1"], model: ["model1"] },
        },
      ],
      [
        "should return photos with multiple different filters",
        {
          album: photos[0].dir,
          source: photos[0].source,
          filterBy: { make: ["make1", "make2"], model: ["model1"] },
        },
      ],
      [
        "should return photos with order ASC",
        {
          album: photos[0].dir,
          source: photos[0].source,
          orderBy: "DATE_ASC",
        },
      ],
      [
        "should return photos with order DESC",
        {
          album: photos[0].dir,
          source: photos[0].source,
          orderBy: "DATE_DESC",
        },
      ],
    ];

    tests.forEach(([description, args]) => {
      it(description, async () => {
        // Initialize
        await saveAllData(connection, { sources, albums, photos });

        // Run
        const results = await getSearchResolver()({}, args, {
          connection,
          user: null,
        });

        // Test
        expect(results).toMatchSnapshot();
      });
    });

    ([
      ["without filters", {}],
      ["with orderBy", { orderBy: "DATE_ASC" }],
      ["with filterBy", { filterBy: { model: "model1" } }],
    ] as [string, NexusGenArgTypes["Query"]["getSearch"]][]).forEach(
      ([description, overrides]) =>
        it(`should return the cache results if the same query is run twice ${description}`, async () => {
          // Initialize
          await saveAllData(connection, { sources, albums, photos });
          jest.spyOn(connection.getRepository(Photo), "find");

          const runSearch = async (): Promise<void> => {
            // Run
            const results = await getSearchResolver()(
              {},
              {
                album: photos[0].dir,
                source: photos[0].source,
                ...overrides,
              },
              {
                connection,
                user: null,
              }
            );

            // Test
            expect(results).toMatchSnapshot();
            expect(connection.getRepository(Photo).find).toHaveBeenCalledTimes(
              1
            );
          };

          // Run the search twice
          await runSearch();
          await runSearch();
        })
    );
  });
});
