import Memory from "lowdb/adapters/Memory";
import { createAppStore } from "../../../state";
import { initializeLowDb } from "../../../lowdb";
import { initializeDatabase } from "../../initialize";
import { Album, Photo, Source } from "../../entity";
import {
  generateAlbum,
  generatePhoto,
  generateSource,
} from "../../../../lib/testUtils";

describe.skip("updateStoreOnPhotoSave", () => {
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

  it("should update the store when there is a new photo", async () => {
    const sourceRepository = connection.getRepository(Source);
    const albumRepository = connection.getRepository(Album);
    const photoRepository = connection.getRepository(Photo);

    jest.spyOn(store, "dispatch");

    const source = await sourceRepository.save(generateSource(1));
    const album = await albumRepository.save(generateAlbum(2, source));
    const photo = await photoRepository.save(generatePhoto(3, album));

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "UPDATE_ALBUM_LAST_UPDATED_PHOTO",
      albumId: 2,
      data: { lastUpdatedPhoto: photo.updatedAt },
    });
  });
});
