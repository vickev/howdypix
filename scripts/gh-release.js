var ghRelease = require("gh-release");
const version = require("../lerna.json").version;

if (version.search(/alpha/)) {
  console.log("Alpha version: we do not create a new release in Github.");
  process.exit(1);
}

// all options have defaults and can be omitted
var options = {
  draft: false
};

// or an API token
options.auth = {
  token: process.env.GITHUB_RELEASE_TOKEN
};

ghRelease(options, function(err, result) {
  if (err) throw err;
  console.log(result); // create release response: https://developer.github.com/v3/repos/releases/#response-4
});
