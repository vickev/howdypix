import { objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";

export const Source = (): NexusObjectTypeDef<"Source"> =>
  objectType({
    name: "Source",
    definition(t) {
      t.field("name", { type: "String" });
    }
  });
