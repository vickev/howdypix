import { Connection } from "typeorm";
import { NexusGenArgTypes } from "@howdypix/graphql-schema/schema.d";
import { Photo as EntityPhoto } from "../../../datastore/database/entity/Photo";
import { SearchResult as EntitySearchResult } from "../../../datastore/database/entity/SearchResult";
import { Search as EntitySearch } from "../../../datastore/database/entity/Search";
import { searchHelpers } from "./searchHelpers";
import { AppStore } from "../../../datastore/state";

export const photoHelpers = {
  fetchPhotoSteam: async (
    connection: Connection,
    photo: EntityPhoto,
    args: NexusGenArgTypes["Query"]["getPhoto"]
  ): Promise<EntitySearchResult[]> => {
    const { doSearchWithCache, findSavedSearch } = searchHelpers;

    // 1. Find the search id
    const searchRepository = connection.getRepository(EntitySearch);
    const search = await findSavedSearch(searchRepository, args);

    // 2. Find the order
    const searchResultRepository = connection.getRepository(EntitySearchResult);
    const { order } = (await searchResultRepository.findOne({
      where: {
        search,
        photo,
      },
    })) ?? { order: 0 };

    const NUMBER_PICTURES_TO_DISPLAY = 6;
    const start = order - NUMBER_PICTURES_TO_DISPLAY / 2;

    // 3. Find the other pictures
    return doSearchWithCache(
      connection,
      args,
      start < 0 ? 0 : start,
      NUMBER_PICTURES_TO_DISPLAY
    );
  },
};
