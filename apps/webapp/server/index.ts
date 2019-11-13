import express from "express";
import nextI18NextMiddleware from "next-i18next/middleware";
import nextI18next from "./i18n";
import next from "next";
import cookieParser from "cookie-parser";
import fetch from "isomorphic-unfetch";
import proxy from "http-proxy-middleware";
import {
  mockedGraphQLMiddleware,
  checkFixturesMiddleware
} from "./mock/middleware";
// @ts-ignore
import nextConfig from "../next.config";
import { routes, appDebug } from "@howdypix/utils";
import { validateCode } from "./auth";

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

  if (process.env.NODE_ENV === "test" || process.env.MOCK_GRAPHQL) {
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
  server.get(routes.magickLinkValidation.route, validateCode);

  const authFetch = async <T>(token: string, route: string) =>
    new Promise<T>((resolve, reject) =>
      fetch(`${serverRuntimeConfig.serverApi.url}${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
      }).then(async res => {
        if (res.status === 200) {
          resolve(await res.json());
        } else {
          reject(res.status);
        }
      })
    );

  const fetchUser = (token: string) =>
    authFetch<{ email: string }>(token, routes.authenticatedUser.value());

  const refreshToken = async (refreshToken: string) =>
    authFetch<{ token: string }>(refreshToken, routes.refreshToken.value());

  server.get(
    "*",
    async (req, res, next) => {
      if (/_next/.test(req.originalUrl) || req.originalUrl === "/login") {
        next();
      } else {
        if (req.cookies["token"]) {
          try {
            // Try to authenticate to the server
            const user = await fetchUser(req.cookies["token"]);
            debug("Token is valid - user:", user);
            next();
          } catch (statusCode) {
            debug("Token is expired");

            if (req.cookies["refreshToken"]) {
              debug("Refreshing the token with the refreshToken...");

              try {
                // Try to fetch a new token with the refreshToken
                const newToken = await refreshToken(
                  req.cookies["refreshToken"]
                );

                // Save the new token in the cookie
                res.cookie("token", newToken.token);

                debug("New token generated!");

                next();
              } catch (e) {
                debug("RefreshToken is expired");
                res.redirect("/login");
              }
            } else {
              res.redirect("/login");
            }
          }
        } else {
          res.redirect("/login");
        }
      }
    },
    (req, res) => handle(req, res)
  );

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
