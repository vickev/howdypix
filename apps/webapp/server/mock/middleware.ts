import express from "express";
import fs from "fs";
import graphqlHTTP from "express-graphql";
import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";

import * as fixtureData from "./fixtures";

const schema = makeExecutableSchema({
  typeDefs: fs.readFileSync(
    require.resolve("@howdypix/graphql-schema/schema.graphql"),
    "utf8"
  )
});

const loadFixtures = (req: express.Request) => {
  const fixtureSet = req.header("Fixture-set") || req.query["fixture-set"];
  const fixtures: { [key: string]: any } = fixtureData;

  if (fixtureSet && fixtures[fixtureSet]) {
    return fixtures[fixtureSet];
  }

  return null;
};

const checkFixturesMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (loadFixtures(req) !== null) {
    next();
  } else {
    next("The fixture set is incorrect.");
  }
};

const mockedGraphQLMiddleware = (req: express.Request) => {
  const fixtures = loadFixtures(req);

  addMockFunctionsToSchema({
    schema,
    mocks: {
      Query: () => fixtures
    }
  });

  // @ts-ignore
  graphqlHTTP({ schema }).apply(this, arguments);
};

export { mockedGraphQLMiddleware, checkFixturesMiddleware };
