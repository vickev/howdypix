import { objectType } from "nexus";

export const Hello = objectType({
  name: "Hello",
  definition(t) {
    t.id("id");
    t.string("name", { nullable: true });
    t.string("type", { nullable: true });
  }
});
