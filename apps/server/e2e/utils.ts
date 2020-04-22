/* eslint-disable import/first, import/no-extraneous-dependencies */
// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
require("dotenv").config();

import { NexusGenFieldTypes } from "@howdypix/graphql-schema/schema.d";
import { HttpLink } from "apollo-link-http";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "node-fetch";
import gql from "graphql-tag";
import { TokenInfo } from "@howdypix/shared-types";
import axios from "axios";
import { routes } from "@howdypix/utils";

/**
 * Create an Apollo client to connect to the Apollo server to run queries for integration tests.
 */
const link = new HttpLink({
  uri: `${process.env.API_BASE_URL || "http://localhost:3004"}/graphql`,
  // NOTE: this TS error is disabled because fetch is advised by Apollo, so we're just gonne ignore it
  // @ts-ignore
  fetch,
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

/**
 * Utility function to fetch the magic link code.
 */
export const fetchMagicLinkCode = async (): Promise<string | null> => {
  const data = await client.mutate<NexusGenFieldTypes["Mutation"]>({
    mutation: gql`
      mutation AuthEmail($email: String!) {
        authEmail(email: $email) {
          messageId
          messageData
          code
        }
      }
    `,
    variables: {
      email: "dev@vickev.com",
    },
  });

  return data.data?.authEmail.code ?? null;
};

/**
 * Utility function to fetch the tokens depending on the code.
 */
export const fetchTokens = async (forceCode?: string): Promise<TokenInfo> => {
  const code = forceCode || (await fetchMagicLinkCode());

  const response = await axios.post<TokenInfo>(routes.codeValidation.value(), {
    code,
  });

  return response.data;
};
