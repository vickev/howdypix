import {
  NexusGenArgTypes,
  NexusGenFieldTypes
} from "@howdypix/graphql-schema/schema.d";
import { appDebug, generateThumbnailUrls } from "@howdypix/utils";
import { Photo as EntityPhoto } from "../../entity/Photo";
import { ApolloContext } from "../../types.d";
import config from "../../config";

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
