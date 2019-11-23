import React, { ReactElement } from "react";
import App from "next/app";
import Head from "next/head";

import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import nextI18next from "../server/i18n";
import theme from "../src/theme";

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
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </ThemeProvider>
      </>
    );
  }
}

export default nextI18next.appWithTranslation(MyApp);
