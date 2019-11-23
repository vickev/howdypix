import { UserProvider } from "./userContext";
import React, {
  ComponentClass,
  ComponentType,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import {
  GetAlbumQuery,
  GetAlbumQueryVariables,
  GetCurrentUserQuery,
  GetCurrentUserQueryVariables
} from "../../__generated__/schema-types";
import { deepEqual } from "assert";
import { useTranslation } from "react-i18next";

//========================================
// GraphQL queries
//========================================
const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
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

    return (
      <UserProvider
        value={{
          user: data?.currentUser,
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
