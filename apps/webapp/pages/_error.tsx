import React from "react";
import { useTranslation } from "react-i18next";
import Error, { ErrorProps } from "next/error";
import { NextPage, NextPageContext } from "next";

type InitialProps = { namespacesRequired: string[] } | ErrorProps;

const Page: NextPage<ErrorProps, InitialProps> = ({ statusCode, title }) => {
  useTranslation("common");
  return <Error statusCode={statusCode} title={title} />;
};

Page.getInitialProps = async (ctx: NextPageContext): Promise<InitialProps> => {
  return { ...Error.getInitialProps(ctx), namespacesRequired: ["common"] };
};

export default Page;
