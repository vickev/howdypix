import { NexusGenArgTypes } from "@howdypix/graphql-schema/schema.d";
import { Photo } from "../src/entity";
import { getSearchResolver } from "../src/schema/search/searchResolvers";
import { initialize, resetValues, saveAllData } from "./schema.setup";

describe("search resolver", () => {
  const { connection, reset } = initialize();

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    await reset();
  });

  describe("with a full database", () => {
    let { sources, albums, photos } = resetValues();

    beforeEach(() => {
      const newValues = resetValues();
      sources = newValues.sources;
      albums = newValues.albums;
      photos = newValues.photos;
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
