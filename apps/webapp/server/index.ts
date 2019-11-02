import express from "express";
import nextI18NextMiddleware from "next-i18next/middleware";
import nextI18next from "./i18n";
import next from "next";
import fs from "fs";
import proxy from "http-proxy-middleware";
import { buildClientSchema } from "graphql";
import bodyParser from "body-parser";
import graphqlHTTP from "express-graphql";
import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
  mockServer
} from "graphql-tools";
import { NexusGenTypes } from "@howdypix/graphql-schema/schema";
// @ts-ignore
import nextConfig from "../next.config";

const { serverRuntimeConfig } = nextConfig;
const port = serverRuntimeConfig.port;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const schema = makeExecutableSchema({
  typeDefs: fs.readFileSync(
    require.resolve("@howdypix/graphql-schema/schema.graphql"),
    "utf8"
  )
});

type GetAlbum = (
  params: NexusGenTypes["argTypes"]["Query"]["getAlbum"]
) => NexusGenTypes["fieldTypes"]["Query"]["getAlbum"];

const getAlbum: GetAlbum = params => {
  return {
    album: { name: "test", dir: "test", source: "test" },
    albums: [{ name: params.album || "test", dir: "", source: "" }],
    photos: [
      {
        id: "id1",
        thumbnails: ["toto", "http://localhost:3004/static/toto", "toto"]
      }
    ]
  };
};

addMockFunctionsToSchema({
  schema,
  mocks: {
    Query: () => ({
      getAlbum
    })
  }
});

app.prepare().then(() => {
  const server = express();

  server.use(nextI18NextMiddleware(nextI18next));

  server.use("/graphql", graphqlHTTP({ schema }));

  /*
  server.use(
    "/graphql",
    proxy({ target: serverRuntimeConfig.serverApollo.url, changeOrigin: true })
  );
  */

  server.get("*", (req, res) => handle(req, res));

  server.listen(port, (err: any) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
