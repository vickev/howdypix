import { useContext } from "react";
import { UserContext, UserContextData } from "./userContext";

export const useCurrentUser = (): UserContextData => {
  return useContext(UserContext);
};
