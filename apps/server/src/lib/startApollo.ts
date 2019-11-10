import { makeSchema } from "nexus";
import * as types from "../schema";
import { join } from "path";
import { transform } from "lodash";
import { State, User, UserConfigState } from "../state";
import { Express } from "express";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import passport from "passport";
import config from "../config";
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

export function startApollo(
  app: Express,
  userConfig: UserConfigState,
  port: number
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
    context: () => ({
      // TODO it's here we need to implement the authorization thing
      isAuthorized: () => true
    })
  });

  apolloServer.applyMiddleware({ app, path: "/graphql" });
}
