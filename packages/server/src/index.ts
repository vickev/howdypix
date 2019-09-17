import { join } from "path";
import * as types from "./schema";
import { makeSchema } from "nexus";
import { ApolloServer } from "apollo-server";

const destDir = join(__dirname, "..", "..", "graphql-schema");

const schema = makeSchema({
  types,
  outputs: {
    schema: join(destDir, "schema.graphql"),
    typegen: join(destDir, "schema.d.ts")
  }
});

const server = new ApolloServer({ schema });

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
