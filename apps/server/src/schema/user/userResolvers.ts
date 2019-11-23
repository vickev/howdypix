import { NexusGenFieldTypes } from "@howdypix/graphql-schema/schema";
import { appDebug } from "@howdypix/utils";
import { ApolloContext } from "../../types";

const debug = appDebug("gql:user");

export const getCurrentUserResolver = () => (
  root: {},
  args: {},
  ctx: ApolloContext
): NexusGenFieldTypes["Query"]["getCurrentUser"] => ctx.user;
