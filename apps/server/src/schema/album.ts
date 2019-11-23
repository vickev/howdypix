import { objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";

export const Album = (): NexusObjectTypeDef<"Album"> =>
  objectType({
    name: "Album",
    definition(t) {
      t.field("name", { type: "String" });
      t.field("dir", { type: "String" });
      t.field("source", { type: "String" });
    }
  });
