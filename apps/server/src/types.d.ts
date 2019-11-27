import { UserInfo } from "@howdypix/shared-types";
import { NexusExtendTypeDef } from "nexus/dist/definitions/extendType";
import { UserConfigState } from "./state";
import { Connection } from "typeorm";

export type ApolloContext = {
  user: UserInfo | null;
  connection: Connection;
};

export type EnhancedQuery = (
  userConfig: UserConfigState
) => NexusExtendTypeDef<"Query">;

export type EnhancedMutation = (
  userConfig: UserConfigState
) => NexusExtendTypeDef<"Mutation">;
