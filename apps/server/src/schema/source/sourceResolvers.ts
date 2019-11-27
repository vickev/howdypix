import { NexusGenFieldTypes } from "@howdypix/graphql-schema/schema.d";
import { UserConfigState } from "../../state";

export const getSourcesResolver = (
  photoDirs: UserConfigState["photoDirs"]
) => (): NexusGenFieldTypes["Query"]["getSources"] => {
  return Object.keys(photoDirs).map(name => ({
    name
  }));
};
