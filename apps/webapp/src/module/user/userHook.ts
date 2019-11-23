import { UserContext, UserContextData } from "./userContext";
import { useContext } from "react";
import { GetCurrentUserQuery } from "../../__generated__/schema-types";

export const useCurrentUser = (): UserContextData => {
  return useContext(UserContext);
};
