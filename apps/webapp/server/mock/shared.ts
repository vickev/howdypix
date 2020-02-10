import { Mutation } from "./types.d";

export const authEmail: Mutation["authEmail"] = (_, params) => {
  if (params.email === "success@vickev.com") {
    return {
      messageId: "AUTH_EMAIL_OK"
    };
  }
  if (params.email === "error@vickev.com") {
    return {
      messageId: "AUTH_EMAIL_ERR",
      messageData: "More information"
    };
  }

  return {
    messageId: "AUTH_EMAIL_ERR_NOT_EXIST"
  };
};
