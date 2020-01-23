import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
  NexusGenRootTypes
} from "@howdypix/graphql-schema/schema.d";
import { appDebug, generateThumbnailUrls } from "@howdypix/utils";
import { FindOneOptions } from "typeorm";
import { Photo as EntityPhoto } from "../../entity/Photo";
import { SearchResult as EntitySearchResult } from "../../entity/SearchResult";
import { Search as EntitySearch } from "../../entity/Search";
import config from "../../config";
import { ApolloContext } from "../../types.d";

const debug = appDebug("gql");

const getOrderBy = (
  order: NexusGenArgTypes["Query"]["getSearch"]["orderBy"]
): FindOneOptions<EntityPhoto>["order"] => {
  switch (order) {
    case "DATE_ASC":
      return { birthtime: "ASC" };
    case "DATE_DESC":
      return { birthtime: "DESC" };
    case "NAME_ASC":
      return { file: "ASC" };
    case "NAME_DESC":
      return { file: "DESC" };
    default:
      return { birthtime: "DESC" };
  }
};

export const getSearchResolver = () => async (
  root: {},
  args: NexusGenArgTypes["Query"]["getSearch"],
  ctx: ApolloContext
): Promise<NexusGenFieldTypes["Query"]["getSearch"]> => {
  debug(`Fetching album ${args.album}.`);

  const searchRepository = ctx.connection.getRepository(EntitySearch);
  const searchResultRepository = ctx.connection.getRepository(
    EntitySearchResult
  );

  const searchResults: EntitySearchResult[] = [];
  const search = await searchRepository.findOne({
    where: {
      orderBy: args.orderBy,
      album: args.album ?? "",
      source: args.source ?? ""
    }
  });

  if (!search) {
    // We create the new entry in the Search table
    const newSearch = new EntitySearch();
    newSearch.source = args.source ?? "";
    newSearch.album = args.album ?? "";
    newSearch.orderBy = args.orderBy ?? "";

    await searchRepository.save(newSearch);

    // We search for the terms according to the criterias
    const photoRepository = ctx.connection.getRepository(EntityPhoto);
    const where: { dir?: string; source?: string } = {};
    if (args.album) {
      where.dir = args.album;
    }
    if (args.source) {
      where.source = args.source;
    }

    const photos = await photoRepository.find({
      where,
      order: getOrderBy(args.orderBy)
    });

    // We save the results in the table
    await Promise.all(
      photos.map(async (photo, key) => {
        const newSearchResult = new EntitySearchResult();
        newSearchResult.order = key;
        newSearchResult.photo = photo;
        newSearchResult.search = newSearch;
        searchResults.push(await searchResultRepository.save(newSearchResult));
      })
    );
  } else {
    // Fetch the search results
    (
      await searchResultRepository.find({
        where: {
          search
        },
        relations: ["photo"],
        order: { order: "ASC" }
      })
    ).forEach(s => {
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
