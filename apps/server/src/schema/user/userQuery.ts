import { extendType } from "nexus";
import { NexusExtendTypeDef } from "nexus/dist/definitions/extendType";
import { getCurrentUserResolver } from "./userResolvers";

export const getCurrentUser = (): NexusExtendTypeDef<"Query"> =>
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
