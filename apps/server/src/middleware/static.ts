import { HPathDir } from "@howdypix/shared-types";
import { hparse, thumbnailPath } from "@howdypix/utils";
import { state } from "../state";
import { Handler } from "express";

export const staticHandler: Handler = (req, res) => {
  const hpath: HPathDir = req.params[0];
  res.sendFile(thumbnailPath(state.userConfig.thumbnailsDir, hparse(hpath)));
};
