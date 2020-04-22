import { NexusGenArgTypes } from "@howdypix/graphql-schema/schema.d";
import {
  FindOneOptions,
  Repository,
  Connection,
  Between,
  FindOperator,
} from "typeorm";
import { sortJsonStringify } from "@howdypix/utils";
import { Photo as EntityPhoto } from "../entity/Photo";
import { SearchResult as EntitySearchResult } from "../entity/SearchResult";
import { Search as EntitySearch } from "../entity/Search";
import { filterByMake, filterByModel } from "../lib/filters";

export const searchHelpers = {
  getOrderBy: (
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
  },

  findSavedSearch: async (
    searchRepository: Repository<EntitySearch>,
    args: NexusGenArgTypes["Query"]["getSearch"]
  ): Promise<EntitySearch | undefined> =>
    searchRepository.findOne({
      where: {
        orderBy: args.orderBy ?? null,
        filterBy: args.filterBy ? sortJsonStringify(args.filterBy) : null,
        album: args.album ?? "",
        source: args.source ?? "",
      },
    }),

  saveNewSearch: async (
    searchRepository: Repository<EntitySearch>,
    args: NexusGenArgTypes["Query"]["getSearch"]
  ): Promise<EntitySearch> => {
    const newSearch = new EntitySearch();
    newSearch.source = args.source ?? "";
    newSearch.album = args.album ?? "";

    if (args.orderBy) {
      newSearch.orderBy = args.orderBy;
    }

    if (args.filterBy) {
      newSearch.filterBy = sortJsonStringify(args.filterBy);
    }

    return searchRepository.save(newSearch);
  },

  doSearch: async (
    photoRepository: Repository<EntityPhoto>,
    args: NexusGenArgTypes["Query"]["getSearch"]
  ): Promise<EntityPhoto[]> => {
    // Define the where statement to filter the right photos
    const where: { dir?: string; source?: string } = {};
    where.dir = args.album ?? "";

    if (args.source) {
      where.source = args.source;
    }

    return photoRepository.find({
      where: {
        ...where,
        ...filterByMake(args.filterBy?.make).whereStatement,
        ...filterByModel(args.filterBy?.model).whereStatement,
      },
      order: searchHelpers.getOrderBy(args.orderBy),
    });
  },

  saveSearchResult: async (
    searchResultRepository: Repository<EntitySearchResult>,
    photos: EntityPhoto[],
    search: EntitySearch
  ): Promise<EntitySearchResult[]> =>
    Promise.all(
      photos.map(async (photo, key) => {
        const newSearchResult = new EntitySearchResult();
        newSearchResult.order = key;
        newSearchResult.photo = photo;
        newSearchResult.search = search;
        return searchResultRepository.save(newSearchResult);
      })
    ),

  fetchSearchResult: async (
    searchResultRepository: Repository<EntitySearchResult>,
    search: EntitySearch,
    start: number,
    limit: number | null
  ): Promise<EntitySearchResult[]> => {
    const where: { search: EntitySearch; order?: FindOperator<number> } = {
      search,
    };

    if (limit) {
      where.order = Between(start, start + limit);
    }

    return searchResultRepository.find({
      where,
      relations: ["photo"],
      order: { order: "ASC" },
    });
  },

  doSearchWithCache: async (
    connection: Connection,
    args: NexusGenArgTypes["Query"]["getSearch"],
    start = 0,
    limit: number | null = null
  ): Promise<EntitySearchResult[]> => {
    const searchRepository = connection.getRepository(EntitySearch);
    const photoRepository = connection.getRepository(EntityPhoto);
    const searchResultRepository = connection.getRepository(EntitySearchResult);

    const searchResults: EntitySearchResult[] = [];
    const search = await searchHelpers.findSavedSearch(searchRepository, args);

    if (!search) {
      // We create the new entry in the Search table
      const newSearch = await searchHelpers.saveNewSearch(
        searchRepository,
        args
      );

      // We search for the terms according to the criterias
      const photos = await searchHelpers.doSearch(photoRepository, args);

      (
        await searchHelpers.saveSearchResult(
          searchResultRepository,
          photos,
          newSearch
        )
      ).forEach((s) => {
        if (limit) {
          if (s.order >= start && s.order < start + limit) {
            searchResults.push(s);
          }
        } else {
          searchResults.push(s);
        }
      });
    } else {
      // Fetch the search results
      (
        await searchHelpers.fetchSearchResult(
          searchResultRepository,
          search,
          start,
          limit
        )
      ).forEach((s) => {
        searchResults.push(s);
      });
    }

    return searchResults;
  },
};
