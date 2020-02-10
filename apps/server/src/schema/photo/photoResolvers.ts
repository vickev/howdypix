import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
  NexusGenRootTypes
} from "@howdypix/graphql-schema/schema.d";
import {
  appDebug,
  generateThumbnailUrls,
  sortJsonStringify
} from "@howdypix/utils";
import { Photo as EntityPhoto } from "../../entity/Photo";
import { Search as EntitySearch } from "../../entity/Search";
import { ApolloContext } from "../../types.d";
import config from "../../config";
import { SearchResult as EntitySearchResult } from "../../entity/SearchResult";
// TODO => should not happen
import { doSearchWithCache, findSavedSearch } from "../search/searchHelpers";

const debug = appDebug("gql");

export const getPhotoResolver = () => async (
  root: {},
  args: NexusGenArgTypes["Query"]["getPhoto"],
  ctx: ApolloContext
): Promise<NexusGenFieldTypes["Query"]["getPhoto"]> => {
  debug(`Fetching photo ${args.file}.`);

  const photoRepository = ctx.connection.getRepository(EntityPhoto);

  const photo = await photoRepository.findOne({
    where: { dir: args.album, source: args.source, file: args.file }
  });

  if (photo) {
    return {
      id: photo.id.toString(),
      files: generateThumbnailUrls(config.serverApi.baseUrl, {
        file: photo.file,
        source: photo.source,
        name: photo.file,
        dir: photo.dir
      }).map(tn => tn.url)
    };
  }

  return null;
};

export const getPhotoStreamResolver = () => async (
  root: {},
  args: NexusGenArgTypes["Query"]["getStreamPhoto"],
  ctx: ApolloContext
): Promise<NexusGenFieldTypes["Query"]["getStreamPhoto"]> => {
  debug(`Fetching photo ${args.file}.`);

  // const searchResultRepository = ctx.connection.getRepository(
  //   EntitySearchResult
  // );
  //
  // const { order } = (await searchResultRepository
  //   .createQueryBuilder("sr")
  //   .leftJoinAndSelect(
  //     "sr.search",
  //     "s",
  //     "s.orderBy = :orderBy AND s.filterBy = :filterBy AND s.album = :album AND s.source = :source",
  //     {
  //       orderBy: args.orderBy,
  //       filterBy: args.filterBy ? sortJsonStringify(args.filterBy) : null,
  //       album: args.album ?? "",
  //       source: args.source ?? ""
  //     }
  //   )
  //   .leftJoinAndSelect(
  //     "sr.photo",
  //     "p",
  //     "p.dir = :dir AND p.source = :source AND p.source = :source",
  //     { dir: args.album, source: args.source, file: args.file }
  //   )
  //   .getOne()) ?? { order: 0 };
  //
  // console.log(order);
  //
  // const searchResults: EntitySearchResult[] = await doSearchWithCache(
  //   ctx.connection,
  //   args,
  //   order,
  //   5
  // );

  // 1. Find the order number of the photo in the current search
  const photoRepository = ctx.connection.getRepository(EntityPhoto);
  const photo = await photoRepository.findOne({
    where: { dir: args.album, source: args.source, file: args.file }
  });

  // 2. Find the search id
  const searchRepository = ctx.connection.getRepository(EntitySearch);
  const search = await findSavedSearch(searchRepository, args);

  // 3. Find the order
  const searchResultRepository = ctx.connection.getRepository(
    EntitySearchResult
  );
  const { order } = (await searchResultRepository.findOne({
    where: {
      search,
      photo
    }
  })) ?? { order: 0 };

  const NUMBER_PICTURES_TO_DISPLAY = 6;
  const start = order - NUMBER_PICTURES_TO_DISPLAY / 2;
  const limit =
    start < 0 ? NUMBER_PICTURES_TO_DISPLAY - start : NUMBER_PICTURES_TO_DISPLAY;

  // 4. Find the other pictures
  const searchResults: EntitySearchResult[] = await doSearchWithCache(
    ctx.connection,
    args,
    start,
    limit
  );

  return {
    photos: searchResults.map(
      (sr): NexusGenRootTypes["PhotoStreamThumbnail"] => ({
        id: String(sr.photo.id),
        thumbnails: generateThumbnailUrls(
          config.serverApi.baseUrl,
          sr.photo
        ).map(tn => tn.url)
      })
    )
  };
};
