import { makeSchema } from "nexus";
import * as types from "../schema";
import { join } from "path";
import { transform } from "lodash";
import { UserConfigState } from "../state";
import { Express } from "express";
import { isTokenValid } from "../lib/auth";

const { ApolloServer } = require("apollo-server-express");

type Types = {
  [key: string]: (userConfig: UserConfigState) => any;
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
  userConfig: UserConfigState
) {
  const schema = makeSchema({
    types: transform(
      types as Types,
      (acc, value, key) => {
        acc[key] = value(userConfig);
      },
      {} as { [key: string]: any }
    ),
    outputs: {
      schema: join(destDir, "schema.graphql"),
      typegen: join(destDir, "schema.d.ts")
    }
  });

  const apolloServer = new ApolloServer({
    schema,
    context: async ({ req }: { req: Request }) => ({
      // @ts-ignore
      user: await isTokenValid(req.headers.token)
    })
  });

  apolloServer.applyMiddleware({ app, path: "/graphql" });
}
