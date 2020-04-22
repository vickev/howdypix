import { mutationField, stringArg } from "nexus";
import { authEmailResolver } from "./authResolvers";
import { EnhancedMutation } from "../../types.d";

export const authEmail: EnhancedMutation = (appConfig, userConfig) =>
  mutationField("authEmail", {
    type: "AuthEmailType",
    args: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      email: stringArg(),
    },
    resolve: authEmailResolver(
      appConfig.smtp,
      userConfig.users,
      userConfig.emailSender
    ),
  });
