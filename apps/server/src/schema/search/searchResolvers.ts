import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
  NexusGenRootTypes,
} from "@howdypix/graphql-schema/schema.d";
import { appDebug, generateThumbnailUrls } from "@howdypix/utils";
import { SearchResult as EntitySearchResult } from "../../entity/SearchResult";
import { appConfig } from "../../config";
import { ApolloContext } from "../../types.d";
import { searchHelpers } from "../../helpers/searchHelpers";

const { doSearchWithCache } = searchHelpers;

const debug = appDebug("gql");

export const getSearchResolver = () => async (
  root: {},
  args: NexusGenArgTypes["Query"]["getSearch"],
  ctx: ApolloContext
): Promise<NexusGenFieldTypes["Query"]["getSearch"]> => {
  debug(`Fetching album ${args.album}.`);

  const searchResults: EntitySearchResult[] = await doSearchWithCache(
    ctx.connection,
    args
  );

  return {
    photos:
      searchResults?.map(
        (
          searchResult: EntitySearchResult
        ): NexusGenRootTypes["SearchPhoto"] => ({
          id: searchResult.photo.id.toString(),
          thumbnails: generateThumbnailUrls(appConfig.webapp.baseUrl, {
            file: searchResult.photo.file,
            dir: searchResult.photo.dir,
            source: searchResult.photo.source,
          }).map((tn) => tn.url),
          file: searchResult.photo.file,
          birthtime: Math.round(searchResult.photo.birthtime),
        })
      ) ?? [],
  };
};
