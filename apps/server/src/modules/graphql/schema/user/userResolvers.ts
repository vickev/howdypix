import { NexusGenFieldTypes } from "@howdypix/graphql-schema/schema";
import { ApolloContext } from "../../../../types";

export const getCurrentUserResolver = () => (
  root: {},
  args: {},
  ctx: ApolloContext
): NexusGenFieldTypes["Query"]["getCurrentUser"] => ctx.user;
