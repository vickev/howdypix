import { appDebug, routes } from "@howdypix/utils";
import {
  generateToken,
  generateTokens,
  isCodeValid,
  isRefreshTokenValid,
  isTokenValid,
  removeCode,
  storeRefreshToken
} from "../lib/auth";
import { Handler } from "express";

const debug = appDebug("http");

/**
 * Check if the code to register is in the memory and is valid.
 * If so, it means that the right user wants to connect, and we are
 * ready to generate the connection token.
 */
export const codeValidationHandler: Handler = async (req, res) => {
  const params = routes.codeValidation.checkParams(req.body);
  const user = await isCodeValid(params.code);

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
};

/**
 * Checks if the user is authenticated, and returns the user object if so.
 * Otherwise returns 401.
 */
export const isAuthenticatedHandler: Handler = async (req, res) => {
  const params = routes.authenticatedUser.checkParams(req.body);
  const user = await isTokenValid(params.token);

  if (user) {
    res.json(user);
  } else {
    res.sendStatus(401);
  }
};

export const refreshTokenHandler: Handler = async (req, res) => {
  const params = routes.refreshToken.checkParams(req.body);
  debug(`Refresh token with: ${params.token}`);

  const user = await isRefreshTokenValid(params.token);

  if (user) {
    res.json({
      token: await generateToken(user)
    });
  } else {
    res.sendStatus(401);
  }
};
