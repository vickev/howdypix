import { UserInfo } from "@howdypix/shared-types";
import { NexusExtendTypeDef } from "nexus/dist/definitions/extendType";
import { Connection } from "typeorm";
import { UserConfigState } from "./state";

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
