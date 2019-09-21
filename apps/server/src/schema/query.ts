import { objectType } from "nexus";

export const Query = objectType({
  name: "Query",
  definition(t) {
    t.int("bar", {
      resolve: () => 10
    });
  }
});