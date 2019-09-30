import React from "react";
import { useTranslation } from "react-i18next";
import Error, { ErrorProps } from "next/error";
import { NextPage, NextPageContext } from "next";

const Page: NextPage<ErrorProps> = props => {
  useTranslation("common");
  return <Error {...props} />;
};

Page.getInitialProps = async (ctx: NextPageContext) => {
  return Error.getInitialProps(ctx);
};

export default Page;
