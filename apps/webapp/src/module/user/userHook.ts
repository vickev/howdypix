import { useContext } from "react";
import { UserContext, UserContextData } from "./userContext";
import { GetCurrentUserQuery } from "../../__generated__/schema-types";

export const useCurrentUser = (): UserContextData => {
  return useContext(UserContext);
};
