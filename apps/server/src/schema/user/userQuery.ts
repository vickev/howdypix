import { extendType, nonNull, nullable } from "nexus";
import { getCurrentUserResolver } from "./userResolvers";
import { EnhancedQuery } from "../../types.d";

export const getCurrentUser: EnhancedQuery = () =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  extendType({
    type: "Query",
    definition(t) {
      t.field("getCurrentUser", {
        type: nullable("CurrentUserType"),
        resolve: getCurrentUserResolver(),
      });
    },
  });
