#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require("child_process");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { parse } = require("yaml");

require("yargs") // eslint-disable-line
  .command(
    "start <config_file_yaml>",
    "start the server",
    yargs => {
      yargs.positional("config_file_yaml", {
        describe: "The configuration file to load written in YAML"
      });
    },
    argv => {
      const content = fs.readFileSync(
        join(process.cwd(), argv.config_file_yaml)
      );

      const config = parse(content.toString());

      execSync(
        `NODE_CONFIG='${JSON.stringify(
          config
        )}' node ${__dirname}/../build/index.js`,
        {
          stdio: "inherit"
        }
      );
    }
  ).argv;
