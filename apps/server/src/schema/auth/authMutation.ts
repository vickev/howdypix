import { mutationField, stringArg } from "nexus";
import { NexusExtendTypeDef } from "nexus/dist/definitions/extendType";
import { authEmailResolver } from "./authResolvers";
import { UserConfigState } from "../../state";

export const authEmail = (
  userConfig: UserConfigState
): NexusExtendTypeDef<"Mutation"> =>
  mutationField("authEmail", {
    type: "AuthEmailType",
    args: {
      email: stringArg()
    },
    resolve: authEmailResolver(userConfig.users, userConfig.emailSender)
  });
