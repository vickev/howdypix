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

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface NexusGenPluginTypeConfig<TypeName extends string> {}
  interface NexusGenPluginFieldConfig<
    TypeName extends string,
    FieldName extends string
  > {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface NexusGenPluginSchemaConfig {}
}
