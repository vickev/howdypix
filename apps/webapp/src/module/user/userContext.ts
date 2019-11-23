import React from "react";
import { GetCurrentUserQuery } from "../../__generated__/schema-types";

export type UserContextData = {
  user?: GetCurrentUserQuery["currentUser"] | null;
  logout: () => void;
};

export const UserContext = React.createContext<UserContextData>({
  user: null,
  logout: () => {}
});

export const UserProvider = UserContext.Provider;
