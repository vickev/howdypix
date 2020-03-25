import React, { ComponentType } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { appDebug } from "@howdypix/utils";
import {
  GetCurrentUserQuery,
  GetCurrentUserQueryVariables,
} from "../../__generated__/schema-types";
import { UserProvider } from "./userContext";

const debug = appDebug("withUser");

//= =======================================
// GraphQL queries
//= =======================================
const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      name
      email
    }
  }
`;

export const withUser = <P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> => (props): React.ReactElement => {
  const { data } = useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(
    GET_CURRENT_USER
  );

  if (data) {
    debug("Currently logged in user:", data?.getCurrentUser);
  }

  return (
    <UserProvider
      value={{
        user: data?.getCurrentUser,
        logout: (): void => {
          window.location.replace("/logout");
        },
      }}
    >
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <WrappedComponent {...props} />
    </UserProvider>
  );
};
