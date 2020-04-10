require("dotenv").config();

/* eslint-disable import/no-extraneous-dependencies, no-console */
// eslint-disable-next-line prefer-destructuring
const exec = require("child-process-promise").exec;
const spawn = require("child-process-promise").spawn;
const fs = require("fs-extra");
const { join, parse } = require("path");
const lernaJson = require("../lerna.json");

const epicConsoleLog = (message) => {
  console.log("");
  console.log("========================================");
  console.log(message);
  console.log("========================================");
};

const extremeConsoleLog = (message) => {
  console.log("");
  console.log("****************************************************");
  console.log("****************************************************");
  console.log(message);
  console.log("****************************************************");
  console.log("****************************************************");
};

const isDirectory = (source) => fs.lstatSync(source).isDirectory();
const getDirectories = (source) =>
  fs
    .readdirSync(source)
    .map((name) => join(source, name))
    .filter(isDirectory);

//const apps = ["/home/anomen/workspace/howdypix/apps/worker"];
const apps = getDirectories(join(__dirname, "..", "apps"));

const loginToDockerHub = async () =>
  exec(
    `docker login --username=${
      process.env.DOCKER_HUB_LOGIN
    } --password='${process.env.DOCKER_HUB_PASSWORD.replace("'", "\\'")}'`
  );

const buildImage = async (directory) =>
  new Promise((resolve, reject) => {
    const name = parse(directory).name;

    epicConsoleLog(`Building docker for ${name}...`);

    process.chdir(directory);
    const promise = spawn("docker", ["build", "--no-cache", "."], {
      capture: ["stdout", "stderr"],
    });

    promise.childProcess.stdout.on("data", function (data) {
      process.stdout.write(data.toString());
    });
    promise.childProcess.stderr.on("data", function (data) {
      process.stdout.write(data.toString());
    });

    promise
      .then(function ({ stdout }) {
        resolve({
          name,
          directory,
          id: /Successfully built ([^ \n]+)/gm.exec(stdout.toString())[1],
        });
      })
      .catch(function (err) {
        reject(err);
      });
  });

const tagImage = async ({ directory, name, id }) => {
  const version = require(join(directory, "package.json")).version;
  const versions = [version];

  epicConsoleLog("Create tags");
  console.log(`Tagging ${id} for ${name}:${version}...`);

  process.chdir(directory);
  const { stdout } = await exec(`docker tag ${id} howdypix/${name}:${version}`);

  // Check if we are at the latest commit
  const currentHash = (await exec(`git rev-parse --short HEAD`)).stdout.replace(
    "\n",
    ""
  );
  if (
    (
      await exec(
        `git log ${currentHash} --oneline --decorate=full | head -n 1 | grep refs/remotes/origin/master`
      )
    ).stdout !== ""
  ) {
    // Check if we have a release
    if (/^[0-9]+\.[0-9]+\.[0-9]+$/.exec(version)) {
      versions.push("latest");
      console.log(`Tagging ${id} for ${name}:latest...`);
      await exec(`docker tag ${id} howdypix/${name}:latest`);
    } else {
      // else it's a pre-release
      versions.push("next");
      console.log(`Tagging ${id} for ${name}:next...`);
      await exec(`docker tag ${id} howdypix/${name}:next`);
    }
  }

  return { directory, name, id, versions };
};

const uploadImage = async ({ directory, name, versions }) => {
  epicConsoleLog("Upload images");

  return Promise.all(
    versions.map(async (version) => {
      console.log(`Pushing ${name}:${version}...`);

      process.chdir(directory);
      console.log(
        (await exec(`docker push howdypix/${name}:${version}`)).stdout
      );
      console.log(`Pushing ${name}:${version}... DONE`);
    })
  );
};

const handleErrors = (err) => {
  console.error(`${err.message}`);
  process.exit(1);
};

apps
  .reduce((promise, directory) => {
    return promise.then(() => {
      extremeConsoleLog(directory);
      return buildImage(directory)
        .then(tagImage)
        .then(uploadImage)
        .catch(handleErrors);
    });
  }, loginToDockerHub())
  .catch(handleErrors);
