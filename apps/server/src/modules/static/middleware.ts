import { HPathDir } from "@howdypix/shared-types";
import { hparse, thumbnailPath } from "@howdypix/utils";
import { Handler } from "express";
import { join } from "path";
import { userConfig } from "../../lib/config";

export const staticHandler: Handler = (req, res) => {
  const hpath: HPathDir = req.params[0];
  res.sendFile(
    join(process.cwd(), thumbnailPath(userConfig.thumbnailsDir, hparse(hpath)))
  );
};
