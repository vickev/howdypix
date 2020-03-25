import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
  NexusGenRootTypes,
} from "@howdypix/graphql-schema/schema.d";
import { appDebug, generateThumbnailUrls } from "@howdypix/utils";
import { Photo as EntityPhoto } from "../../entity/Photo";
import { ApolloContext } from "../../types.d";
import { appConfig } from "../../config";
import { photoHelpers } from "../../helpers/photoHelpers";

const debug = appDebug("gql");

export const getPhotoResolver = () => async (
  root: {},
  args: NexusGenArgTypes["Query"]["getPhoto"],
  ctx: ApolloContext
): Promise<NexusGenFieldTypes["Query"]["getPhoto"]> => {
  debug(`Fetching photo ${args.file}.`);

  const photoRepository = ctx.connection.getRepository(EntityPhoto);
  const photo = await photoRepository.findOne({
    where: { dir: args.album, source: args.source, file: args.file },
  });

  if (photo) {
    const photoSteam = await photoHelpers.fetchPhotoSteam(
      ctx.connection,
      photo,
      args
    );
    const photoIndexInStream = photoSteam.findIndex(
      (sr) => sr.photoId === photo.id
    );

    return {
      id: photo.id.toString(),
      files: generateThumbnailUrls(appConfig.webapp.baseUrl, {
        file: photo.file,
        source: photo.source,
        name: photo.file,
        dir: photo.dir,
      }).map((tn) => tn.url),
      aperture: photo.processedAperture,
      shutter: photo.processedShutter,
      iso: photo.ISO,
      make: photo.make,
      model: photo.model,
      birthtime: photo.birthtime,
      next: photoSteam[photoIndexInStream + 1]?.photo.file ?? null,
      previous: photoSteam[photoIndexInStream - 1]?.photo.file ?? null,
      photoStream: photoSteam.map(
        (sr): NexusGenRootTypes["PhotoStreamThumbnail"] => ({
          id: String(sr.photo.id),
          file: String(sr.photo.file),
          thumbnails: generateThumbnailUrls(
            appConfig.webapp.baseUrl,
            sr.photo
          ).map((tn) => tn.url),
        })
      ),
    };
  }

  return null;
};
