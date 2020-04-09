import React, { useEffect } from "react";
import Head from "next/head";

import { ThemeProvider } from "styled-components";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import nextI18next from "../server/i18n";
import theme from "../src/theme";
import { withStore } from "../src/context/store/withStore";
import { withApollo } from "../src/lib/with-apollo-client";
import { Layout } from "../src/module/layout/Layout";

const MyApp: React.FC<{
  Component: React.ComponentType<{ displayWithLayout?: boolean }>;
  pageProps: object;
}> = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  });

  return (
    <>
      <Head>
        <title>My page</title>
      </Head>
      <style jsx global>
        {`
          html,
          body,
          #__next {
            height: 100%;
          }
        `}
      </style>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {Component.defaultProps?.displayWithLayout ? (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          ) : (
            <Component {...pageProps} />
          )}
        </ThemeProvider>
      </MuiThemeProvider>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export default withApollo(nextI18next.appWithTranslation(withStore(MyApp)));
