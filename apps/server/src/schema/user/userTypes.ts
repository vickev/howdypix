import { enumType, objectType } from "nexus";

export const CurrentUserType = () =>
  objectType({
    name: "CurrentUserType",
    definition(t) {
      t.field("name", { type: "String", nullable: false });
      t.field("email", { type: "String", nullable: false });
    }
  });
