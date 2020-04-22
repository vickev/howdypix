import {
  Express,
  NextFunction,
  Response,
  Request,
  RequestHandler,
} from "express";
import fetch from "isomorphic-unfetch";
import { appDebug, routes } from "@howdypix/utils";
import axios from "axios";
import { TokenInfo } from "@howdypix/shared-types";
import nextConfig from "../../next.config";
import { Cookies, Locals } from "../types.d";

const { serverRuntimeConfig } = nextConfig;
const debug = appDebug("middleware:auth");

const authFetch = async <T>(token: string, route: string): Promise<T> =>
  new Promise((resolve, reject) =>
    fetch(`${serverRuntimeConfig.serverApi.url}${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    }).then(async (res) => {
      if (res.status === 200) {
        resolve(await res.json());
      } else {
        reject(res.status);
      }
    })
  );

const fetchUser = (token: string): Promise<{ email: string }> =>
  authFetch(token, routes.authenticatedUser.value());

const refreshToken = async (refreshToken: string): Promise<{ token: string }> =>
  authFetch(refreshToken, routes.refreshToken.value());

export const authHandler = (
  options: {
    failureCallback: (req: Request, res: Response, next: NextFunction) => void;
  } = {
    failureCallback: (req, res): void => {
      res.redirect("/login");
    },
  }
): RequestHandler => async (req, res, next): Promise<void> => {
  const { cookies } = req as {
    cookies: Cookies;
  };
  const { locals } = res as {
    locals: Locals;
  };

  if (/_next/.test(req.originalUrl) || /^\/login/.test(req.originalUrl)) {
    next();
  } else if (cookies.token) {
    try {
      // Try to authenticate to the server
      const user = await fetchUser(cookies.token);
      debug("Token is valid - user:", user);
      locals.token = cookies.token;
      next();
    } catch (statusCode) {
      debug("Token is expired");

      if (cookies.refreshToken) {
        debug("Refreshing the token with the refreshToken...");

        try {
          // Try to fetch a new token with the refreshToken
          const newToken = await refreshToken(cookies.refreshToken);

          // Save the new token in the cookie
          res.cookie("token", newToken.token);

          debug("New token generated!");

          locals.token = newToken.token;

          next();
        } catch (e) {
          debug("RefreshToken is expired");
          options.failureCallback(req, res, next);
        }
      } else {
        options.failureCallback(req, res, next);
      }
    }
  } else {
    options.failureCallback(req, res, next);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isTokenInfo = (tokens: any): tokens is TokenInfo => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return !!tokens.token && !!tokens.refreshToken;
};

export const applyAuthMiddleware = (app: Express): void => {
  routes.magickLinkValidation.applyMiddleware(app, async (req, res, next) => {
    // Request for the validation
    const response = await axios.post<TokenInfo | { error: string }>(
      `${serverRuntimeConfig.serverApi.url}${routes.codeValidation.value()}`,
      {
        code: req.params.code,
      }
    );

    /**
     * This weird querystring is to pass some querystrings down to the redirect
     */
    const querystring = `?${[
      req.query["fixture-set"] && `fixture-set=${req.query["fixture-set"]}`,
    ]
      .filter((p) => p)
      .join("&")}`;

    if (isTokenInfo(response.data)) {
      res.cookie("token", response.data.token);
      res.cookie("refreshToken", response.data.refreshToken);
      res.redirect(`/${querystring === "?" ? "" : querystring}`);
    } else {
      next();
    }
  });

  app.get("/logout", (req, res) => {
    debug("Logging out the user.");
    res.cookie("token", "loggedout");
    res.cookie("refreshToken", "loggedout");
    res.redirect("/login");
  });
};
