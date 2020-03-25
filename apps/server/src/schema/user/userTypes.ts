import { objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";

export const CurrentUserType = (): NexusObjectTypeDef<"CurrentUserType"> =>
  objectType({
    name: "CurrentUserType",
    definition(t) {
      t.field("name", { type: "String", nullable: false });
      t.field("email", { type: "String", nullable: false });
    },
  });
