import Memory from "lowdb/adapters/Memory";
import { EventEmitter } from "events";
import { createAppStore } from "../../../state";
import { initializeLowDb } from "../../../lowdb";
import { initializeDatabase } from "../../initialize";
import { Album, Photo, Source } from "../../entity";
import {
  generateAlbum,
  generatePhoto,
  generateSource,
} from "../../../../lib/testUtils";

describe.skip("updateStoreOnAlbumSave", () => {
  const store = createAppStore();
  const statedb = initializeLowDb(Memory);
  const event = new EventEmitter();
  const connection = initializeDatabase({ path: ":memory:" }, store, event);

  beforeEach(async () => {
    if (connection.isConnected) {
      await connection.close();
    }

    await statedb.setState({ albums: {}, searches: {} }).write();
    await connection.connect();
  });

  it("should update the store when there is a new photo", async () => {
    const sourceRepository = connection.getRepository(Source);
    const albumRepository = connection.getRepository(Album);

    jest.spyOn(store, "dispatch");

    const source = await sourceRepository.save(generateSource(1));
    const album = await albumRepository.save(generateAlbum(1, source));

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "STORE_NEW_ALBUM",
      albumId: 1,
      data: { lastUpdatedPhoto: null },
    });
  });
});
