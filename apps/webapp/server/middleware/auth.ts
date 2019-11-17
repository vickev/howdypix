import { Handler } from "express";
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

export const validateCode: Handler = async (req, res, next) => {
  console.log(req.params.code);
  // Request for the validation
  const response = await axios.post(
    `${serverRuntimeConfig.serverApi.url}${routes.codeValidation.value()}`,
    {
      code: req.params.code
    }
  );

  const tokens: TokenInfo | { error: string } = response.data;
  const querystring =
    "?" +
    [req.query["fixture-set"] && "fixture-set=" + req.query["fixture-set"]]
      .filter(p => p)
      .join("&");

  if (!tokens.hasOwnProperty("error")) {
    res.cookie("token", (tokens as TokenInfo).token);
    res.cookie("refreshToken", (tokens as TokenInfo).refreshToken);
    res.redirect("/" + (querystring === "?" ? "" : querystring));
  } else {
    next();
  }
};
