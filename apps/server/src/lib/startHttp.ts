import express from "express";
import { state } from "../state";
import { howdypixPathJoin } from "@howdypix/utils";

export function startHttp(port: number) {
  const app = express();

  app.get("/static/:sourceId/*", (req, res) => {
    console.log(req.params.sourceId);

    res.sendFile(
      howdypixPathJoin(
        state.userConfig.thumbnailsDir,
        req.params.sourceId,
        req.params[0]
      )
    );
  });

  app.listen({ port }, () => {
    console.log(`Http server stated on port ${port}.`);
  });
}
