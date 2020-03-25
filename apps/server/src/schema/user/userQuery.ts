import { extendType } from "nexus";
import { getCurrentUserResolver } from "./userResolvers";
import { EnhancedQuery } from "../../types.d";

export const getCurrentUser: EnhancedQuery = () =>
  extendType({
    type: "Query",
    definition(t) {
      t.field("getCurrentUser", {
        type: "CurrentUserType",
        nullable: true,
        resolve: getCurrentUserResolver(),
      });
    },
  });
