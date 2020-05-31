import { NexusGenArgTypes } from "@howdypix/graphql-schema/schema.d";
import { getPhotoResolver } from "../src/modules/graphql/schema/photo/photoResolvers";
import { initialize, resetValues } from "./schema.setup";

describe("photo resolver", () => {
  const { connection, reset, saveAllData, store } = initialize();

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest
      .spyOn(global.Date, "now")
      .mockImplementation(() => new Date("2019-05-14T11:01:58.135Z").valueOf());

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

    ([
      [
        "should return photo without current filter / order",
        {
          album: photos[0].dir,
          source: photos[0].source,
          file: photos[0].file,
        },
      ],
      [
        "should return photo with current filter",
        {
          album: photos[0].dir,
          source: photos[0].source,
          file: photos[0].file,
          filterBy: { model: [photos[0].model] },
        },
      ],
      [
        "should return photo with current order",
        {
          album: photos[0].dir,
          source: photos[0].source,
          file: photos[0].file,
          orderBy: "DATE_ASC",
        },
      ],
      [
        "should return photo with both filter and order",
        {
          album: photos[0].dir,
          source: photos[0].source,
          file: photos[0].file,
          filterBy: { model: [photos[0].model] },
          orderBy: "DATE_ASC",
        },
      ],
    ] as [string, NexusGenArgTypes["Query"]["getPhoto"]][]).forEach(
      ([description, args]) => {
        it(description, async () => {
          // Initialize
          await saveAllData(connection, { sources, albums, photos });

          // Run
          const results = await getPhotoResolver()({}, args, {
            connection,
            store,
            user: null,
          });

          // Test
          expect(results).toMatchSnapshot();
        });
      }
    );
  });
});
