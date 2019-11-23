import { UserProvider } from "./userContext";
import React, { ComponentType } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import {
  GetCurrentUserQuery,
  GetCurrentUserQueryVariables
} from "../../__generated__/schema-types";
import { appDebug } from "@howdypix/utils";

const debug = appDebug("withUser");

//========================================
// GraphQL queries
//========================================
const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      name
      email
    }
  }
`;

export const withUser = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): ComponentType<P> => {
  return props => {
    const { loading, error, data } = useQuery<
      GetCurrentUserQuery,
      GetCurrentUserQueryVariables
    >(GET_CURRENT_USER);

    if (data) {
      debug("Currently logged in user:", data?.getCurrentUser);
    }

    return (
      <UserProvider
        value={{
          user: data?.getCurrentUser,
          logout: () => {
            window.location.replace("/logout");
          }
        }}
      >
        <WrappedComponent {...props} />
      </UserProvider>
    );
  };
};
