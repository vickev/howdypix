import { objectType } from "nexus";

export const Hello = objectType({
  name: "Hello",
  definition(t) {
    t.id("id");
    t.string("toto", { nullable: true });
    t.string("type", { nullable: true });
  }
});
