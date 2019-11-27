import { mutationField, stringArg } from "nexus";
import { authEmailResolver } from "./authResolvers";
import { EnhancedMutation } from "../../types.d";

export const authEmail: EnhancedMutation = userConfig =>
  mutationField("authEmail", {
    type: "AuthEmailType",
    args: {
      email: stringArg()
    },
    resolve: authEmailResolver(userConfig.users, userConfig.emailSender)
  });
