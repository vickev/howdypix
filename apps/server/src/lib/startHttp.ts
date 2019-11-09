import express from "express";
import { state } from "../state";
import { hparse, routes, thumbnailPath } from "@howdypix/utils";
import { HPathDir } from "@howdypix/shared-types";
import * as emails from "../email";

export function startHttp(port: number) {
  const app = express();

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

  app.listen({ port }, () => {
    console.log(`Http server stated on port ${port}.`);
  });
}
