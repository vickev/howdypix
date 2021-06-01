import { enumType, nonNull, nullable, objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";
import { NexusEnumTypeDef } from "nexus/dist/definitions/enumType";

export const AuthEmailMessage = (): NexusEnumTypeDef<"AuthEmailMessage"> =>
  enumType({
    name: "AuthEmailMessage",
    members: ["AUTH_EMAIL_OK", "AUTH_EMAIL_ERR_NOT_EXIST", "AUTH_EMAIL_ERR"],
    description:
      "The type of message that the user can get when requesting a magic link.",
  });

export const AuthEmailType = (): NexusObjectTypeDef<"AuthEmailType"> =>
  objectType({
    name: "AuthEmailType",
    definition(t) {
      t.field("messageId", { type: "AuthEmailMessage" });
      t.field("messageData", { type: nullable("String") });
      t.field("code", { type: nullable("String") });
    },
  });
