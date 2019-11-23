import { objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";

export const Photo = (): NexusObjectTypeDef<"Photo"> =>
  objectType({
    name: "Photo",
    definition(t) {
      t.id("id");
      t.field("thumbnails", { type: "String", list: [false] });
    }
  });
