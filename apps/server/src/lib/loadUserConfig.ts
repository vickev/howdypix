import fs from "fs";
import path from "path";
import { parse } from "yaml";
import { state } from "../state";

export function loadUserConfig() {
  const content = fs.readFileSync(
    path.join(__dirname, "..", "..", "config.yaml")
  );

  state.userConfig = parse(content.toString());
  return state.userConfig;
}
