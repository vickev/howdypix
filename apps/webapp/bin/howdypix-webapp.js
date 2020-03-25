#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require("child_process");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { load } = require("js-yaml");

process.chdir(join(__dirname, ".."));

require("yargs") // eslint-disable-line
  .command(
    "start <config_file_yaml>",
    "start the webapp",
    (yargs) => {
      yargs.positional("config_file_yaml", {
        describe: "The configuration file to load written in YAML",
      });
    },
    (argv) => {
      const absolutePath = join(process.cwd(), argv.config_file_yaml);

      if (fs.existsSync(absolutePath)) {
        const content = fs.readFileSync(absolutePath);
        const config = load(content.toString());

        execSync(
          `NODE_ENV=production NODE_CONFIG='${JSON.stringify(
            config
          )}' node ${__dirname}/../dist/server/index.js`,
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
