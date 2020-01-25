import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
  NexusGenRootTypes
} from "@howdypix/graphql-schema/schema.d";
import { appDebug, generateThumbnailUrls } from "@howdypix/utils";
import { Photo as EntityPhoto } from "../../entity/Photo";
import { SearchResult as EntitySearchResult } from "../../entity/SearchResult";
import { Search as EntitySearch } from "../../entity/Search";
import config from "../../config";
import { ApolloContext } from "../../types.d";
import {
  findSavedSearch,
  saveNewSearch,
  doSearch,
  saveSearchResult,
  fetchSearchResult
} from "./searchHelpers";

const debug = appDebug("gql");

export const getSearchResolver = () => async (
  root: {},
  args: NexusGenArgTypes["Query"]["getSearch"],
  ctx: ApolloContext
): Promise<NexusGenFieldTypes["Query"]["getSearch"]> => {
  debug(`Fetching album ${args.album}.`);

  const searchRepository = ctx.connection.getRepository(EntitySearch);
  const photoRepository = ctx.connection.getRepository(EntityPhoto);
  const searchResultRepository = ctx.connection.getRepository(
    EntitySearchResult
  );

  const searchResults: EntitySearchResult[] = [];
  const search = await findSavedSearch(searchRepository, args);

  if (!search) {
    // We create the new entry in the Search table
    const newSearch = await saveNewSearch(searchRepository, args);

    // We search for the terms according to the criterias
    const photos = await doSearch(photoRepository, args);

    (await saveSearchResult(searchResultRepository, photos, newSearch)).forEach(
      s => {
        searchResults.push(s);
      }
    );
  } else {
    // Fetch the search results
    (await fetchSearchResult(searchResultRepository, search)).forEach(s => {
      searchResults.push(s);
    });
  }

  return {
    photos:
      searchResults?.map(
        (
          searchResult: EntitySearchResult
        ): NexusGenRootTypes["SearchPhoto"] => ({
          id: searchResult.photo.id.toString(),
          thumbnails: generateThumbnailUrls(config.serverApi.baseUrl, {
            file: searchResult.photo.file,
            dir: searchResult.photo.dir,
            source: searchResult.photo.source
          }).map(tn => tn.url),
          file: searchResult.photo.file,
          birthtime: Math.round(searchResult.photo.birthtime)
        })
      ) ?? []
  };
};
