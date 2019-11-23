import * as React from "react";
import { NextPage } from "next";
import { LoginBox } from "../src/module/login/LoginBox";

type InitialProps = { namespacesRequired: string[] };

const Component: NextPage<{}, InitialProps> = () => <LoginBox />;

Component.getInitialProps = async (): Promise<InitialProps> => ({
  namespacesRequired: ["common"]
});

export default Component;
