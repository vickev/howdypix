import { appDebug, routes } from "@howdypix/utils";
import { Express } from "express";
import {
  generateToken,
  generateTokens,
  isCodeValid,
  isRefreshTokenValid,
  isTokenValid,
  removeCode,
  storeRefreshToken,
} from "./lib";

const debug = appDebug("middleware:auth");

export const applyAuthMiddleware = (app: Express): void => {
  /**
   * Check if the code to register is in the memory and is valid.
   * If so, it means that the right user wants to connect, and we are
   * ready to generate the connection token.
   */
  routes.codeValidation.applyMiddleware(app, async (req, res) => {
    const user = await isCodeValid(req.body.code || "");

    // The code is valid
    if (user) {
      // Remove the code
      removeCode(user.email);

      // Generate a new token
      const tokens = await generateTokens(user);

      // Store the refreshToken
      storeRefreshToken(tokens);

      // Return them
      res.json(tokens);
    } else {
      res.json({ error: "Token expired" });
    }
  });

  /**
   * Checks if the user is authenticated, and returns the user object if so.
   * Otherwise returns 401.
   */
  routes.authenticatedUser.applyMiddleware(app, async (req, res) => {
    const user = await isTokenValid(req.body.token || "");

    if (user) {
      res.json(user);
    } else {
      res.sendStatus(401);
    }
  });

  routes.refreshToken.applyMiddleware(app, async (req, res) => {
    debug(`Refresh token with: ${req.body.token}`);

    const user = await isRefreshTokenValid(req.body.token || "");

    if (user) {
      res.json({
        token: await generateToken(user),
      });
    } else {
      res.sendStatus(401);
    }
  });
};
