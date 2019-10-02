import { objectType } from "nexus";

export const Album = objectType({
  name: "Album",
  definition(t) {
    t.field("name", { type: "String" });
    t.field("dir", { type: "String" });
    t.field("source", { type: "String" });
  }
});
