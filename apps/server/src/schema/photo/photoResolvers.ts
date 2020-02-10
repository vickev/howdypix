import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
  NexusGenRootTypes
} from "@howdypix/graphql-schema/schema.d";
import { appDebug, generateThumbnailUrls } from "@howdypix/utils";
import { Connection } from "typeorm";
import { Photo as EntityPhoto } from "../../entity/Photo";
import { Search as EntitySearch } from "../../entity/Search";
import { ApolloContext } from "../../types.d";
import config from "../../config";
import { SearchResult as EntitySearchResult } from "../../entity/SearchResult";
// TODO => should not happen
import { doSearchWithCache, findSavedSearch } from "../search/searchHelpers";

const debug = appDebug("gql");

export const fetchPhotoSteam = async (
  connection: Connection,
  photo: EntityPhoto,
  args: NexusGenArgTypes["Query"]["getPhoto"]
): Promise<EntitySearchResult[]> => {
  // 2. Find the search id
  const searchRepository = connection.getRepository(EntitySearch);
  const search = await findSavedSearch(searchRepository, args);

  // 3. Find the order
  const searchResultRepository = connection.getRepository(EntitySearchResult);
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
  return doSearchWithCache(connection, args, start, limit);
};

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
    const photoSteam = await fetchPhotoSteam(ctx.connection, photo, args);
    const photoIndexInStream = photoSteam.findIndex(
      sr => sr.photoId === photo.id
    );

    return {
      id: photo.id.toString(),
      files: generateThumbnailUrls(config.serverApi.baseUrl, {
        file: photo.file,
        source: photo.source,
        name: photo.file,
        dir: photo.dir
      }).map(tn => tn.url),
      next: photoSteam[photoIndexInStream + 1]?.photo.file ?? null,
      previous: photoSteam[photoIndexInStream - 1]?.photo.file ?? null,
      photoStream: photoSteam.map(
        (sr): NexusGenRootTypes["PhotoStreamThumbnail"] => ({
          id: String(sr.photo.id),
          file: String(sr.photo.file),
          thumbnails: generateThumbnailUrls(
            config.serverApi.baseUrl,
            sr.photo
          ).map(tn => tn.url)
        })
      )
    };
  }

  return null;
};
