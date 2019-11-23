import { extendType } from "nexus";
import { getCurrentUserResolver } from "./userResolvers";
import { UserConfigState } from "../../state";

export const getCurrentUser = (userConfig: UserConfigState) =>
  extendType({
    type: "Query",
    definition(t) {
      t.field("getCurrentUser", {
        type: "CurrentUserType",
        nullable: true,
        resolve: getCurrentUserResolver()
      });
    }
  });
