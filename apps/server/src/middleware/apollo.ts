import { makeSchema } from "nexus";
import { join } from "path";
import { transform } from "lodash";
import { Express, Request } from "express";
import { ApolloServer } from "apollo-server-express";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";
import { NexusExtendTypeDef } from "nexus/dist/definitions/extendType";
import { NexusEnumTypeDef } from "nexus/dist/definitions/enumType";
import { Connection } from "typeorm";
import { UserConfig } from "../config";
import * as types from "../schema";
import { isTokenValid } from "../lib/auth";
import { ApolloContext } from "../types.d";

type NexusEntity =
  | NexusExtendTypeDef<string>
  | NexusObjectTypeDef<string>
  | NexusEnumTypeDef<string>;

type GraphQLTypes = {
  [key: string]: (userConfig: UserConfig) => NexusEntity;
};

const destDir = join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "libs",
  "graphql-schema"
);

export function applyApolloMiddleware(
  app: Express,
  userConfig: UserConfig,
  connection: Connection
): void {
  const schema = makeSchema({
    types: transform(
      (types as unknown) as GraphQLTypes,
      (acc, value, key) => {
        // We pass the `userConfig` to all the resolvers to be consumed
        acc[key] = value(userConfig);
      },
      {} as { [key: string]: NexusEntity }
    ),
    outputs: {
      schema: join(destDir, "schema.graphql"),
      typegen: join(destDir, "schema.d.ts")
    }
  });

  const apolloServer = new ApolloServer({
    schema,
    context: async ({ req }: { req: Request }): Promise<ApolloContext> => ({
      user: await isTokenValid((req.headers.token as string) || ""),
      connection
    }),
    playground: {
      settings: {
        "request.credentials": "include"
      }
    }
  });

  apolloServer.applyMiddleware({ app, path: "/graphql" });
}
