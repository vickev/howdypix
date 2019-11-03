import express from "express";
import nextI18NextMiddleware from "next-i18next/middleware";
import nextI18next from "./i18n";
import next from "next";
import proxy from "http-proxy-middleware";
import {
  mockedGraphQLMiddleware,
  checkFixturesMiddleware
} from "./mock/middleware";
// @ts-ignore
import nextConfig from "../next.config";

const { serverRuntimeConfig } = nextConfig;
const port = serverRuntimeConfig.port;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(nextI18NextMiddleware(nextI18next));

  if (process.env.NODE_ENV === "test") {
    console.log("GraphQL will be mocked 🎊");
    server.get("/", checkFixturesMiddleware);
    server.use(
      "/static-tests",
      express.static(__dirname + "/mock/fixtures/static")
    );
    server.use("/graphql", checkFixturesMiddleware, mockedGraphQLMiddleware);
  } else {
    server.use(
      "/graphql",
      proxy({
        target: serverRuntimeConfig.serverApollo.url,
        changeOrigin: true
      })
    );
  }

  server.get("*", (req, res) => handle(req, res));

  server.listen(port, (err: any) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
