import express from "express";
import fs from "fs";
import graphqlHTTP from "express-graphql";
import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";
import { appDebug } from "@howdypix/utils";

import * as fixtureData from "./fixtures";

const schema = makeExecutableSchema({
  typeDefs: fs.readFileSync(
    require.resolve("@howdypix/graphql-schema/schema.graphql"),
    "utf8"
  )
});

const loadFixtures = (
  req: express.Request
): { name: string; fixtures?: any } => {
  const fixtureSet = req.header("Fixture-set") || req.query["fixture-set"];
  const fixtures: { [key: string]: any } = fixtureData;

  if (fixtureSet && fixtures[fixtureSet]) {
    return { name: fixtureSet, fixtures: fixtures[fixtureSet] };
  }

  return { name: fixtureSet };
};

const checkFixturesMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (loadFixtures(req).fixtures) {
    next();
  } else {
    next("The fixture set is incorrect.");
  }
};

const mockedGraphQLMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { name, fixtures } = loadFixtures(req);

  addMockFunctionsToSchema({
    schema,
    mocks: {
      Query: () => fixtures
    }
  });

  appDebug("GraphQL")(`Using fixture set: ${name}`);

  return await graphqlHTTP({ schema })(req, res);
};

export { mockedGraphQLMiddleware, checkFixturesMiddleware };
