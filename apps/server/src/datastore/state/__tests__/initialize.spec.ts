import Memory from "lowdb/adapters/Memory";
import { wait } from "@howdypix/utils";
import { reducer, State } from "../reducer";
import { createAppStore, initializeStore } from "../index";
import { initializeLowDb } from "../../lowdb";
import { initializeDatabase } from "../../database/initialize";
import {
  Album,
  Photo,
  Search,
  SearchResult,
  Source,
} from "../../database/entity";
import {
  generateAlbum,
  generatePhoto,
  generateSearch,
  generateSource,
  mockDate,
} from "../../../lib/testUtils";

describe.skip("state initiliaze", () => {
  const store = createAppStore();
  const statedb = initializeLowDb(Memory);
  const connection = initializeDatabase({ path: ":memory:" }, store);

  beforeEach(async () => {
    if (connection.isConnected) {
      await connection.close();
    }

    await statedb.setState({ albums: {}, searches: {} }).write();
    await connection.connect();
  });

  it("should initialize properly the store", async () => {
    const sourceRepository = connection.getRepository(Source);
    const albumRepository = connection.getRepository(Album);
    const photoRepository = connection.getRepository(Photo);
    const searchRepository = connection.getRepository(Search);
    const searchResultRepository = connection.getRepository(SearchResult);

    jest.spyOn(store, "dispatch");

    const source = await sourceRepository.save(generateSource(1));
    const album = await albumRepository.save(generateAlbum(2, source));

    const photo1 = await photoRepository.save(generatePhoto(3, album));
    await wait(1);
    const photo2 = await photoRepository.save(generatePhoto(4, album));

    const search = await searchRepository.save(
      generateSearch(6, [photo1, photo2])
    );
    await Promise.all(
      search.searchResults.map((searchResult) =>
        searchResultRepository.save(searchResult)
      )
    );

    const utc = new Date().getTimezoneOffset() * 60000;

    // test
    await initializeStore(store, connection, statedb);
    expect(store.getState()).toEqual({
      albums: {
        2: {
          lastUpdatedPhoto: new Date(photo2.updatedAt.getTime() + utc),
        },
      },
      searches: {
        6: {
          album: "album6",
          source: "source6",
          lastUpdatedPhoto: new Date(photo2.updatedAt.getTime() + utc),
        },
      },
    });
  });
});
