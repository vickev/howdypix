import { mutationField, stringArg } from "nexus";
import { authEmailResolver } from "./authResolvers";
import { EnhancedMutation } from "../../types.d";

export const authEmail: EnhancedMutation = (appConfig, userConfig) =>
  mutationField("authEmail", {
    type: "AuthEmailType",
    args: {
      email: stringArg(),
    },
    resolve: authEmailResolver(
      appConfig.smtp,
      userConfig.users,
      userConfig.emailSender
    ),
  });
