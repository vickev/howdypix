import { UserInfo } from "@howdypix/shared-types";
import { NexusExtendTypeDef } from "nexus/dist/definitions/extendType";
import { Connection } from "typeorm";
import { UserConfig, AppConfig } from "./config";

export type ApolloContext = {
  user: UserInfo | null;
  connection: Connection;
};

export type EnhancedQuery = (
  appConfig: AppConfig,
  userConfig: UserConfig
) => NexusExtendTypeDef<"Query">;

export type EnhancedMutation = (
  appConfig: AppConfig,
  userConfig: UserConfig
) => NexusExtendTypeDef<"Mutation">;
