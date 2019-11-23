import express from "express";
import nextI18NextMiddleware from "next-i18next/middleware";
import nextI18next from "./i18n";
import next from "next";
import cookieParser from "cookie-parser";
import proxy from "http-proxy-middleware";
import {
  checkFixturesMiddleware,
  mockedGraphQLMiddleware
} from "./mock/middleware";
// @ts-ignore
import nextConfig from "../next.config";
import { appDebug } from "@howdypix/utils";
import { applyAuthMiddleware, authHandler } from "./middleware/auth";
import mockApiServer from "./mock/mockApiServer";

const { serverRuntimeConfig } = nextConfig;
const port = serverRuntimeConfig.port;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const debug = appDebug("server");

app.prepare().then(() => {
  const server = express();

  server.use(nextI18NextMiddleware(nextI18next));
  server.use(cookieParser());

  if (process.env.MOCK_API) {
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
        target: serverRuntimeConfig.serverApi.url,
        changeOrigin: true
      })
    );
  }

  // Authentication routes
  applyAuthMiddleware(server);

  // Next JS Middleware
  server.get("*", authHandler, (req, res) => handle(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });

  // Oh yeah! We mock the API server so we don't need to run it for the tests!!
  if (process.env.MOCK_API) {
    mockApiServer.listen(serverRuntimeConfig.mock.serverApi.port, () => {
      console.log(
        `> Ready on http://localhost:${serverRuntimeConfig.mock.serverApi.port}`
      );
    });
  }
});
