import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
} from "@howdypix/graphql-schema/schema.d";
import { generateThumbnailUrls } from "@howdypix/utils";
import { UserConfig, appConfig } from "../../config";
import { ApolloContext } from "../../types.d";
import { Source as EntitySource } from "../../entity/Source";

export const getSourcesResolver = (
  photoDirs: UserConfig["photoDirs"]
) => async (
  root: {},
  args: NexusGenArgTypes["Query"]["getAlbum"],
  ctx: ApolloContext
): Promise<NexusGenFieldTypes["Query"]["getSources"]> => {
  const sourceRepository = ctx.connection.getRepository(EntitySource);
  const sources: { [source: string]: EntitySource | null } = {};

  (await sourceRepository.find()).forEach((source) => {
    sources[source.source] = source;
  });

  return Promise.all(
    Object.keys(photoDirs).map(async (name) => ({
      name,
      nbAlbums: (await sources[name]?.getNbPhotos()) ?? 0,
      nbPhotos: (await sources[name]?.getNbPhotos()) ?? 0,
      preview:
        (await sources[name]?.getPreview()) &&
        generateThumbnailUrls(appConfig.webapp.baseUrl, {
          file: await sources[name]?.getPreview(),
          dir: sources[name]?.dir,
          source: name,
        }).map((tn) => tn.url)[0],
    }))
  );
};
