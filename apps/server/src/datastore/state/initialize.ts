import { Connection } from "typeorm";
import { LowdbSync } from "lowdb";
import { Store } from "redux";
import { Action, State } from "./reducer";
import { Album, Search } from "../database/entity";

export type AppStore = Store<State, Action>;

export const initializeStore = async (
  store: AppStore,
  connection: Connection,
  statedb: LowdbSync<State>
): Promise<void> => {
  // ======================================
  // Initialize the data
  // ======================================
  // Search for albums
  await connection
    .getRepository(Album)
    .createQueryBuilder("album")
    .select("album.id", "id")
    .addSelect("MAX(photo.updatedAt)", "lastUpdatedPhoto")
    .leftJoinAndSelect("album.photos", "photo")
    .groupBy("album.id")
    .getRawMany()
    .then((data: { id: Album["id"]; lastUpdatedPhoto: Date | null }[]) =>
      data.forEach(({ id, lastUpdatedPhoto }) => {
        store.dispatch({
          type: "STORE_NEW_ALBUM",
          albumId: id,
          data: {
            lastUpdatedPhoto,
          },
        });
      })
    );

  // Search for saved searches
  await connection
    .getRepository(Search)
    .createQueryBuilder("search")
    .select("search.id", "id")
    .addSelect("search.album", "album")
    .addSelect("search.source", "source")
    .addSelect("MAX(photo.updatedAt)", "lastUpdatedPhoto")
    .leftJoinAndSelect("search.searchResults", "searchResult")
    .leftJoinAndSelect("searchResult.photo", "photo")
    .groupBy("search.id")
    .getRawMany()
    .then(
      (
        data: {
          id: Search["id"];
          album: Search["album"];
          source: Search["source"];
          lastUpdatedPhoto: Date | null;
        }[]
      ) =>
        data.forEach(({ id, album, source, lastUpdatedPhoto }) => {
          store.dispatch({
            type: "STORE_NEW_SEARCH",
            searchId: id,
            data: {
              album,
              source,
              lastUpdatedPhoto,
            },
          });
        })
    );

  // Persist the store
  store.subscribe(() => {
    statedb.setState(store.getState()).write();
  });
};
