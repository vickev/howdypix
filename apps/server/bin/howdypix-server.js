#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require("child_process");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { load } = require("js-yaml");

require("yargs") // eslint-disable-line
  .command(
    "start <config_file_yaml>",
    "start the server",
    (yargs) => {
      yargs.positional("config_file_yaml", {
        describe: "The configuration file to load written in YAML",
      });
    },
    (argv) => {
      const absolutePath = resolve(process.cwd(), argv.config_file_yaml);

      if (fs.existsSync(absolutePath)) {
        const content = fs.readFileSync(absolutePath);
        const config = load(content.toString());

        execSync(
          `NODE_CONFIG='${JSON.stringify(
            config
          )}' node ${__dirname}/../dist/index.js`,
          {
            stdio: "inherit",
          }
        );
      } else {
        console.log(`Cannot find file ${absolutePath}.`);
      }
    }
  )
  .demandCommand().argv;
