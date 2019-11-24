import { NexusGenFieldTypes } from "@howdypix/graphql-schema/schema.d";
import { ApolloContext } from "../../types.d";

export const getCurrentUserResolver = () => (
  root: {},
  args: {},
  ctx: ApolloContext
): NexusGenFieldTypes["Query"]["getCurrentUser"] => ctx.user;
