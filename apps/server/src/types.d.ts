import { UserInfo } from "@howdypix/shared-types";
import { NexusExtendTypeDef } from "nexus/dist/definitions/extendType";
import { Connection } from "typeorm";
import { UserConfig } from "./config";

export type ApolloContext = {
  user: UserInfo | null;
  connection: Connection;
};

export type EnhancedQuery = (
  userConfig: UserConfig
) => NexusExtendTypeDef<"Query">;

export type EnhancedMutation = (
  userConfig: UserConfig
) => NexusExtendTypeDef<"Mutation">;
