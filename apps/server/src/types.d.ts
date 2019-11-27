import { UserInfo } from "@howdypix/shared-types";
import { NexusExtendTypeDef } from "nexus/dist/definitions/extendType";
import { UserConfigState } from "./state";

export type ApolloContext = {
  user: UserInfo | null;
};

export type EnhancedQuery = (
  userConfig: UserConfigState
) => NexusExtendTypeDef<"Query">;

export type EnhancedMutation = (
  userConfig: UserConfigState
) => NexusExtendTypeDef<"Mutation">;
