import {
  NexusGenArgTypes,
  NexusGenFieldTypes
} from "@howdypix/graphql-schema/schema.d";
import { ApolloContext } from "../../types.d";
import { Photo as EntityPhoto } from "../../entity/Photo";

export const getFiltersResolver = () => async (
  root: {},
  args: NexusGenArgTypes["Query"]["getFilters"],
  ctx: ApolloContext
): Promise<NexusGenFieldTypes["Query"]["getFilters"]> => {
  const photoRepository = ctx.connection.getRepository(EntityPhoto);

  const dateTakenRange: {
    from: number | null;
    to: number | null;
  } = await photoRepository
    .createQueryBuilder("photo")
    .select("MIN(photo.birthtime)", "from")
    .addSelect("MAX(photo.birthtime)", "to")
    .where({ dir: args.album ?? "", source: args.source })
    .getRawOne();

  const cameras:
    | {
        make: string;
        model: string;
      }[]
    | null = await photoRepository
    .createQueryBuilder("photo")
    .select("DISTINCT photo.model, photo.make")
    .where({
      dir: args.album ?? "",
      source: args.source
    })
    .getRawMany();

  return {
    cameras:
      cameras
        .filter(({ make, model }) => make !== "" || model !== "")
        .map(({ make, model }) => ({ make, model })) ?? [],
    dateTakenRange
  };
};
