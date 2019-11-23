import { mutationField, stringArg } from "nexus";
import { authEmailResolver } from "./authResolvers";
import { UserConfigState } from "../../state";

export const authEmail = (userConfig: UserConfigState) =>
  mutationField("authEmail", {
    type: "AuthEmailType",
    args: {
      email: stringArg()
    },
    resolve: authEmailResolver(userConfig.users, userConfig.emailSender)
  });
