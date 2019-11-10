import express, { Express } from "express";
import { state } from "../state";
import { hparse, routes, thumbnailPath } from "@howdypix/utils";
import { HPathDir } from "@howdypix/shared-types";
import * as emails from "../email";
import {
  generateTokens,
  isCodeValid,
  removeCode,
  storeRefreshToken
} from "../middleware/auth";

export function startHttp(app: Express, port: number) {
  app.use(express.json());

  app.get("/static/*", (req, res) => {
    const hpath: HPathDir = req.params[0];
    res.sendFile(thumbnailPath(state.userConfig.thumbnailsDir, hparse(hpath)));
  });

  app.get("/email", (req, res) => {
    res.send(
      `<ul>${Object.keys(emails)
        .map(
          templateName =>
            `<li><a href="/email/${templateName}">${templateName}</a></li>`
        )
        .join("")}</ul>`
    );
  });

  app.get("/email/*", (req, res) => {
    const templateName = req.params[0];

    if (!templateName || !emails.hasOwnProperty(templateName)) {
      res.send(
        `Error: The template "${templateName}" does not exist. Select between: [${Object.keys(
          emails
        ).join(", ")}].`
      );
    } else {
      // @ts-ignore
      res.send(emails[templateName](req.query));
    }
  });

  // Authentication routes
  app.post(routes.codeValidation.route, async (req, res) => {
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
  });
}
