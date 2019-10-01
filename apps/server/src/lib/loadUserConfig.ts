import fs from "fs";
import { join } from "path";
import { parse } from "yaml";
import { state } from "../state";

export function loadUserConfig() {
  const content = fs.readFileSync(join(__dirname, "..", "..", "config.yaml"));

  state.userConfig = parse(content.toString());
  state.userConfig.thumbnailsDir = join(
    process.cwd(),
    state.userConfig.thumbnailsDir
  );

  return state.userConfig;
}
