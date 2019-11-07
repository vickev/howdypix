import express from "express";
import fs from "fs";
import graphqlHTTP from "express-graphql";
import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";
import { appDebug } from "@howdypix/utils";

import fixtureData from "./fixtures";

const schema = makeExecutableSchema({
  typeDefs: fs.readFileSync(
    require.resolve("@howdypix/graphql-schema/schema.graphql"),
    "utf8"
  )
});

const loadFixtures = (
  req: express.Request
): { name: string; fixtures?: { query: any; mutation: any } } => {
  const fixtureSet = req.header("Fixture-set") || req.query["fixture-set"];

  // @ts-ignore
  if (fixtureSet && fixtureData[fixtureSet]) {
    // @ts-ignore
    return { name: fixtureSet, fixtures: fixtureData[fixtureSet] };
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

  console.log(fixtures!.mutation);

  addMockFunctionsToSchema({
    schema,
    mocks: {
      Query: () => fixtures && fixtures.query,
      Mutation: () => fixtures && fixtures.mutation
    }
  });

  appDebug("GraphQL")(`Using fixture set: ${name}`);

  return await graphqlHTTP({ schema })(req, res);
};

export { mockedGraphQLMiddleware, checkFixturesMiddleware };
