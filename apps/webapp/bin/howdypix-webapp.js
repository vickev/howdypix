#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require("child_process");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { parse } = require("yaml");

const actualCwd = process.cwd();
process.chdir(join(__dirname, ".."));

require("yargs") // eslint-disable-line
  .command(
    "start <config_file_yaml>",
    "start the webapp",
    yargs => {
      yargs.positional("config_file_yaml", {
        describe: "The configuration file to load written in YAML"
      });
    },
    argv => {
      const content = fs.readFileSync(join(actualCwd, argv.config_file_yaml));

      const config = parse(content.toString());
      execSync(
        `NODE_ENV=production NODE_CONFIG='${JSON.stringify(
          config
        )}' node ${__dirname}/../dist/server/index.js`,
        {
          stdio: "inherit"
        }
      );
    }
  )
  .demandCommand().argv;
