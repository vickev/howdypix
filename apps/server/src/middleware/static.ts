import { HPathDir } from "@howdypix/shared-types";
import { hparse, thumbnailPath } from "@howdypix/utils";
import { Handler } from "express";
import { state } from "../state";

export const staticHandler: Handler = (req, res) => {
  const hpath: HPathDir = req.params[0];
  res.sendFile(thumbnailPath(state.userConfig.thumbnailsDir, hparse(hpath)));
};
