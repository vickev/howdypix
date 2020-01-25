import { NexusGenArgTypes } from "@howdypix/graphql-schema/schema.d";
import { FindOneOptions, Repository } from "typeorm";
import { Photo as EntityPhoto } from "../../entity/Photo";
import { SearchResult as EntitySearchResult } from "../../entity/SearchResult";
import { Search as EntitySearch } from "../../entity/Search";

export const getOrderBy = (
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

export const findSavedSearch = async (
  searchRepository: Repository<EntitySearch>,
  args: NexusGenArgTypes["Query"]["getSearch"]
): Promise<EntitySearch | undefined> =>
  searchRepository.findOne({
    where: {
      orderBy: args.orderBy,
      album: args.album ?? "",
      source: args.source ?? ""
    }
  });

export const saveNewSearch = async (
  searchRepository: Repository<EntitySearch>,
  args: NexusGenArgTypes["Query"]["getSearch"]
): Promise<EntitySearch> => {
  const newSearch = new EntitySearch();
  newSearch.source = args.source ?? "";
  newSearch.album = args.album ?? "";
  newSearch.orderBy = args.orderBy ?? "";

  return searchRepository.save(newSearch);
};

export const doSearch = async (
  photoRepository: Repository<EntityPhoto>,
  args: NexusGenArgTypes["Query"]["getSearch"]
): Promise<EntityPhoto[]> => {
  const where: { dir?: string; source?: string } = {};
  if (args.album) {
    where.dir = args.album;
  }
  if (args.source) {
    where.source = args.source;
  }

  return photoRepository.find({
    where,
    order: getOrderBy(args.orderBy)
  });
};

export const saveSearchResult = async (
  searchResultRepository: Repository<EntitySearchResult>,
  photos: EntityPhoto[],
  search: EntitySearch
): Promise<EntitySearchResult[]> => {
  return Promise.all(
    photos.map(async (photo, key) => {
      const newSearchResult = new EntitySearchResult();
      newSearchResult.order = key;
      newSearchResult.photo = photo;
      newSearchResult.search = search;
      return searchResultRepository.save(newSearchResult);
    })
  );
};

export const fetchSearchResult = async (
  searchResultRepository: Repository<EntitySearchResult>,
  search: EntitySearch
): Promise<EntitySearchResult[]> => {
  return searchResultRepository.find({
    where: {
      search
    },
    relations: ["photo"],
    order: { order: "ASC" }
  });
};
