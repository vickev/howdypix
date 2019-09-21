import { ApolloServer } from "apollo-server";
import { makeSchema } from "nexus";
import * as types from "../schema";
import { join } from "path";

const destDir = join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "libs",
  "graphql-schema"
);

export function startApollo(port: number) {
  const schema = makeSchema({
    types,
    outputs: {
      schema: join(destDir, "schema.graphql"),
      typegen: join(destDir, "schema.d.ts")
    }
  });

  const apolloServer = new ApolloServer({ schema });

  apolloServer.listen({ port }).then(({ url }) => {
    console.log(`🚀  Apollo Server ready at ${url}`);
  });
}
