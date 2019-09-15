import { join } from "path";
import globby from "globby";
import { makeSchema } from "nexus";

globby(join(__dirname, "schemas", "*.js")).then(files => {
  const types = files.map(file => require(file));

  const schema = makeSchema({
    types,
    outputs: {
      schema: join(__dirname, "..", "schema.graphql"),
      typegen: join(__dirname, "..", "schema.d.ts")
    }
  });
});
