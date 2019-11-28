import {
  NexusGenArgTypes,
  NexusGenFieldTypes
} from "@howdypix/graphql-schema/schema.d";
import { UserConfigState } from "../../state";
import { ApolloContext } from "../../types.d";
import { Source as EntitySource } from "../../entity/Source";

export const getSourcesResolver = (
  photoDirs: UserConfigState["photoDirs"]
) => async (
  root: {},
  args: NexusGenArgTypes["Query"]["getAlbum"],
  ctx: ApolloContext
): Promise<NexusGenFieldTypes["Query"]["getSources"]> => {
  const sourceRepository = ctx.connection.getRepository(EntitySource);
  const sources: { [source: string]: EntitySource | null } = {};

  (await sourceRepository.find()).forEach(source => {
    sources[source.source] = source;
  });

  return Object.keys(photoDirs).map(name => ({
    name,
    nbAlbums: sources[name]?.nbAlbums ?? 0,
    nbPhotos: sources[name]?.nbPhotos ?? 0,
    preview: sources[name]?.preview
  }));
};
