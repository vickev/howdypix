import express from "express";
import { state } from "../state";
import { hparse, path2hfile, thumbnailPath } from "@howdypix/utils";

export function startHttp(port: number) {
  const app = express();

  app.get("/static/*", (req, res) => {
    res.sendFile(
      thumbnailPath(state.userConfig.thumbnailsDir, hparse(req.params[0]))
    );
  });

  app.listen({ port }, () => {
    console.log(`Http server stated on port ${port}.`);
  });
}
