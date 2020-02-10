import express from "express";
import fs from "fs";
import graphqlHTTP from "express-graphql";
import { addMockFunctionsToSchema, makeExecutableSchema } from "graphql-tools";
import { appDebug } from "@howdypix/utils";
import fixtureData from "./fixtures";
import { FixtureSet, Mutation, Query } from "./types.d";

const schema = makeExecutableSchema({
  typeDefs: fs.readFileSync(
    require.resolve("@howdypix/graphql-schema/schema.graphql"),
    "utf8"
  )
});

const loadFixtures = (
  req: express.Request
): { name: string; fixtures?: FixtureSet } => {
  const fixtureSet = req.header("Fixture-set") || req.query["fixture-set"];

  if (fixtureSet && fixtureData[fixtureSet]) {
    return { name: fixtureSet, fixtures: fixtureData[fixtureSet] };
  }

  return { name: fixtureSet };
};

const checkFixturesMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  if (loadFixtures(req).fixtures) {
    next();
  } else {
    next("The fixture set is incorrect.");
  }
};

const mockedGraphQLMiddleware = (
  req: express.Request,
  res: express.Response
): Promise<undefined> => {
  const { name, fixtures } = loadFixtures(req);

  addMockFunctionsToSchema({
    schema,
    mocks: {
      Query: (): Query | undefined => fixtures && fixtures.query,
      Mutation: (): Mutation | undefined => fixtures && fixtures.mutation
    }
  });

  appDebug("GraphQL")(`Using fixture set: ${name}`);

  return graphqlHTTP({ schema })(req, res);
};

export { mockedGraphQLMiddleware, checkFixturesMiddleware };
