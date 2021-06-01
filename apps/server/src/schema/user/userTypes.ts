import { nonNull, objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";

export const CurrentUserType = (): NexusObjectTypeDef<"CurrentUserType"> =>
  objectType({
    name: "CurrentUserType",
    definition(t) {
      t.field("name", { type: nonNull("String") });
      t.field("email", { type: nonNull("String") });
    },
  });
