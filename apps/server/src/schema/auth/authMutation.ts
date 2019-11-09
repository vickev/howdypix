import { mutationField, stringArg } from "nexus";
import { authEmailResolver } from "./authResolvers";
import { state } from "../../state";

export const authEmail = mutationField("authEmail", {
  type: "AuthEmailType",
  args: {
    email: stringArg()
  },
  resolve: authEmailResolver(
    state.userConfig.users,
    state.userConfig.emailSender
  )
});
