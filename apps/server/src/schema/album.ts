import { objectType } from "nexus";

export const Album = objectType({
  name: "Album",
  definition(t) {
    t.id("id");
    t.field("name", { type: "String" });
  }
});
