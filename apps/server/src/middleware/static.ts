import { HPathDir } from "@howdypix/shared-types";
import { hparse, thumbnailPath } from "@howdypix/utils";
import { Handler } from "express";
import { userConfig } from "../config";

export const staticHandler: Handler = (req, res) => {
  const hpath: HPathDir = req.params[0];
  res.sendFile(thumbnailPath(userConfig.thumbnailsDir, hparse(hpath)));
};
