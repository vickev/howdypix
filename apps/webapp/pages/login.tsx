import * as React from "react";
import { NextPage } from "next";
import { LoginBox } from "../src/module/login/LoginBox";
import { useStore } from "../src/context/store";

type InitialProps = { namespacesRequired: string[] };

const Component: NextPage<{}, InitialProps> = () => {
  return <LoginBox />;
};

Component.getInitialProps = async (): Promise<InitialProps> => ({
  namespacesRequired: ["common"],
});

Component.defaultProps = {
  displayWithLayout: false,
};

export default Component;
