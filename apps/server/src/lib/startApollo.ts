import { ApolloServer } from "apollo-server";
import { makeSchema } from "nexus";
import * as types from "../schema";
import { join } from "path";
import { transform } from "lodash";
import { State, UserConfigState } from "../state";

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

export function startApollo(userConfig: UserConfigState, port: number) {
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

  const apolloServer = new ApolloServer({ schema });

  apolloServer.listen({ port }).then(({ url }) => {
    console.log(`🚀  Apollo Server ready at ${url}`);
  });
}
