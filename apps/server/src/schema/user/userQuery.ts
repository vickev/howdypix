import { mutationField, queryField, stringArg } from "nexus";
import { currentUserResolver } from "./userResolvers";
import { State, UserConfigState } from "../../state";

export const currentUser = (userConfig: UserConfigState) =>
  queryField("currentUser", {
    type: "CurrentUserType",
    args: {},
    resolve: currentUserResolver()
  });
