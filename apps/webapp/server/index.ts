import express from "express";
import nextI18NextMiddleware from "next-i18next/middleware";
import next from "next";
import cookieParser from "cookie-parser";
import proxy from "http-proxy-middleware";
import nextConfig from "../next.config";
import nextI18next from "./i18n";
import { applyAuthMiddleware, authHandler } from "./middleware/auth";

const { serverRuntimeConfig } = nextConfig;
const { port } = serverRuntimeConfig;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(nextI18NextMiddleware(nextI18next));
  server.use(cookieParser());

  if (process.env.MOCK_API) {
    const {
      checkFixturesMiddleware,
      mockedGraphQLMiddleware
      // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    } = require("./mock/middleware");

    // eslint-disable-next-line no-console
    console.log("GraphQL will be mocked 🎊");
    server.get("/", checkFixturesMiddleware);
    server.use(
      "/static-tests",
      express.static(`${__dirname}/mock/fixtures/static`)
    );
    server.use("/graphql", checkFixturesMiddleware, mockedGraphQLMiddleware);
  } else {
    server.use(
      "/graphql",
      authHandler({
        failureCallback: (req, res, next) => {
          next();
        }
      }),
      (req, res, next) =>
        proxy({
          target: serverRuntimeConfig.serverApi.url,
          changeOrigin: true,
          headers: {
            token: res.locals.token ?? ""
          }
        })(req, res, next)
    );
  }

  // Authentication routes
  applyAuthMiddleware(server);

  // Next JS Middleware
  server.get("*", authHandler(), (req, res) => handle(req, res));

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${port}`);
  });

  // Oh yeah! We mock the API server so we don't need to run it for the tests!!
  if (process.env.MOCK_API) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    const mockApiServer = require("./mock/mockApiServer");

    mockApiServer.listen(serverRuntimeConfig.mock.serverApi.port, () => {
      // eslint-disable-next-line no-console
      console.log(
        `> Ready on http://localhost:${serverRuntimeConfig.mock.serverApi.port}`
      );
    });
  }
});
