import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
import { useRouter } from "next/router";
import { parse as cookieParser } from "cookie";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

let apolloClient: ApolloClient<any>;

type InitialState = {
  fixtureSet: string | null;
  tokens: {
    token: string | null;
    refreshToken: string | null;
  };
  [key: string]: any;
};

type WithApolloProps = {
  apolloClient?: ApolloClient<any>;
  apolloState?: any;
};

type PageComponentProps = {
  apolloClient?: ApolloClient<any>;
};

/**
 * Creates and provides the apolloContext
 * to a next.js PageTree. Use it by wrapping
 * your PageComponent via HOC pattern.
 * @param {Function|Class} PageComponent
 * @param {Object} [config]
 * @param {Boolean} [config.ssr=true]
 */
export function withApollo(PageComponent: NextPage, { ssr = true } = {}) {
  const WithApollo: NextPage<WithApolloProps> = ({
    apolloClient,
    apolloState,
    ...pageProps
  }) => {
    const router = useRouter();
    const fixtureSet = router.query["fixture-set"];
    const tokens: { token?: string; refreshToken?: string } = {};

    if (typeof document !== "undefined") {
      const cookies = cookieParser(document.cookie);
      tokens.token = cookies.token;
      tokens.refreshToken = cookies.refreshToken;
    }

    const client =
      apolloClient || initApolloClient({ ...apolloState, fixtureSet, tokens });
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== "production") {
    const displayName =
      PageComponent.displayName || PageComponent.name || "Component";

    if (displayName === "App") {
      console.warn("This withApollo HOC only works with PageComponents.");
    }

    WithApollo.displayName = `withApollo(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async ctx => {
      // @ts-ignore
      const fixtureSet = ctx?.req?.query?.["fixture-set"];
      // @ts-ignore
      const { token, refreshToken } = ctx?.req?.cookies ?? {
        token: null,
        refreshToken: null
      };
      const { AppTree } = ctx;

      // Initialize ApolloClient, add it to the ctx object so
      // we can use it in `PageComponent.getInitialProp`.
      const apolloClient = initApolloClient({
        fixtureSet,
        tokens: {
          token,
          refreshToken
        }
      });

      // Run wrapped getInitialProps methods
      let pageProps = {};
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps({
          ...ctx
          // apolloClient
        });
      }

      // Only on the server:
      if (typeof window === "undefined") {
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (ctx.res && ctx.res.finished) {
          return pageProps;
        }

        // Only if ssr is enabled
        if (ssr) {
          try {
            // Run all GraphQL queries
            const { getDataFromTree } = await import("@apollo/react-ssr");
            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient
                }}
              />
            );
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            console.error("Error while running `getDataFromTree`", error);
          }

          // getDataFromTree does not call componentWillUnmount
          // head side effect therefore need to be cleared manually
          Head.rewind();
        }
      }

      // Extract query data from the Apollo store
      const apolloState = apolloClient.cache.extract();

      return {
        ...pageProps,
        apolloState,
        token,
        refreshToken
      };
    };
  }

  return WithApollo;
}

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 * @param  {Object} initialState
 */
function initApolloClient(initialState: InitialState): ApolloClient<any> {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === "undefined") {
    return createApolloClient(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createApolloClient(initialState);
  }

  return apolloClient;
}

/**
 * Creates and configures the ApolloClient
 */
function createApolloClient(initialState: InitialState): ApolloClient<any> {
  const { tokens, fixtureSet, ...apolloState } = initialState;
  const headers: { [key: string]: string | null } = {};

  if (fixtureSet) {
    headers["Fixture-set"] = fixtureSet;
  }
  if (tokens.token) {
    headers.token = tokens.token;
  }

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    ssrMode: typeof window === "undefined", // Disables forceFetch on the server (so queries are only run once)
    link: new HttpLink({
      uri: `${
        typeof window !== "undefined"
          ? publicRuntimeConfig.baseUrl
          : `http://localhost:${serverRuntimeConfig.port}`
      }/graphql`, // Server URL (must be absolute)
      credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
      headers,
      fetch
    }),
    cache: new InMemoryCache().restore(initialState as any)
  });
}
