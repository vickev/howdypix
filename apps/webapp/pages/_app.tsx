import React, { ReactElement } from "react";
import App from "next/app";
import Head from "next/head";

import { ThemeProvider } from "styled-components";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import nextI18next from "../server/i18n";
import theme from "../src/theme";
import { withStore } from "../src/context/store/withStore";
import { Layout } from "../src/module/layout/Layout";
import { withApollo } from "../src/lib/with-apollo-client";

class MyApp extends App {
  componentDidMount(): void {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render(): ReactElement {
    const { Component, pageProps } = this.props;

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
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </MuiThemeProvider>
      </>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export default withApollo(withStore(nextI18next.appWithTranslation(MyApp)));
