import express from "express";
import { state } from "../state";
import { hparse, thumbnailPath } from "@howdypix/utils";
import { HPathDir } from "@howdypix/shared-types";

export function startHttp(port: number) {
  const app = express();

  app.get("/static/*", (req, res) => {
    const hpath: HPathDir = req.params[0];
    res.sendFile(thumbnailPath(state.userConfig.thumbnailsDir, hparse(hpath)));
  });

  app.listen({ port }, () => {
    console.log(`Http server stated on port ${port}.`);
  });
}
