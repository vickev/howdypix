import { UserInfo } from "@howdypix/shared-types";
import { NexusExtendTypeDef } from "nexus/dist/definitions/extendType";
import { Connection, EntitySubscriberInterface } from "typeorm";
import { UserConfig, AppConfig } from "./lib/config";
import { AppStore } from "./datastore/state";
import { Events } from "./lib/eventEmitter";

export type ApolloContext = {
  user: UserInfo | null;
  store: AppStore;
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

export type EnhancedSubscriber<T extends EntitySchema> = (
  event: Events,
  store: AppStore
) => EntitySubscriberInterface<T>;
