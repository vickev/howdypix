import { enumType, objectType } from "nexus";

export const AuthEmailMessage = () =>
  enumType({
    name: "AuthEmailMessage",
    members: ["AUTH_EMAIL_OK", "AUTH_EMAIL_ERR_NOT_EXIST", "AUTH_EMAIL_ERR"],
    description:
      "The type of message that the user can get when requesting a magic link."
  });

export const AuthEmailType = () =>
  objectType({
    name: "AuthEmailType",
    definition(t) {
      t.field("messageId", { type: "AuthEmailMessage" });
      t.field("messageData", { type: "String", nullable: true });
      t.field("code", { type: "String", nullable: true });
    }
  });
