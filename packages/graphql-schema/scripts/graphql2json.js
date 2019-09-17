const { buildSchema, graphqlSync, introspectionQuery } = require("graphql");
const path = require("path");
const fs = require("fs");
const prettier = require("prettier");

function run() {
  const sdlString = fs.readFileSync(
    path.join(__dirname, "..", "schema.graphql")
  );
  const graphqlSchemaObj = buildSchema(sdlString.toString());
  const result = graphqlSync(graphqlSchemaObj, introspectionQuery);

  if (result.errors && result.errors.length > 0) {
    throw new Error(
      "An error occurred: " + result.errors.map(e => e.message).join(`, `)
    );
  }

  fs.writeFileSync(
    path.join(__dirname, "..", "schema.json"),
    JSON.stringify(result.data)
  );
  console.log("schema.json generated👍👍👍");
}

try {
  run();
} catch (e) {
  console.log(e.message);
  process.exit(1);
}
