import { Express, Handler } from "express";
import fetch from "isomorphic-unfetch";
import { appDebug, routes } from "@howdypix/utils";
// @ts-ignore
import nextConfig from "../../next.config";
import axios from "axios";
import { TokenInfo } from "@howdypix/shared-types";

const { serverRuntimeConfig } = nextConfig;
const debug = appDebug("middleware:auth");

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

export const authHandler: Handler = async (req, res, next) => {
  if (/_next/.test(req.originalUrl) || /^\/login/.test(req.originalUrl)) {
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
            const newToken = await refreshToken(req.cookies["refreshToken"]);

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
};

const isTokenInfo = (tokens: any): tokens is TokenInfo => {
  return (
    tokens.hasOwnProperty("token") && tokens.hasOwnProperty("refreshToken")
  );
};

export const applyAuthMiddleware = (app: Express) => {
  routes.magickLinkValidation.applyMiddleware(app, async (req, res, next) => {
    // Request for the validation
    const response = await axios.post<TokenInfo | { error: string }>(
      `${serverRuntimeConfig.serverApi.url}${routes.codeValidation.value()}`,
      {
        code: req.params.code
      }
    );

    /**
     * This weird querystring is to pass some querystrings down to the redirect
     */
    const querystring =
      "?" +
      [req.query["fixture-set"] && "fixture-set=" + req.query["fixture-set"]]
        .filter(p => p)
        .join("&");

    if (isTokenInfo(response.data)) {
      res.cookie("token", response.data.token);
      res.cookie("refreshToken", response.data.refreshToken);
      res.redirect("/" + (querystring === "?" ? "" : querystring));
    } else {
      next();
    }
  });

  app.get("/logout", (req, res) => {
    res.cookie("token", "loggedout");
    res.cookie("refreshToken", "loggedout");
    res.redirect("/login");
  });
};
