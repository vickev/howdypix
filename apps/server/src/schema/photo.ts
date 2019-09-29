import { objectType } from "nexus";

export const Photo = objectType({
  name: "Photo",
  definition(t) {
    t.id("id");
    t.field("thumbnails", { type: "String", list: [false] });
  }
});
