import * as React from "react";
import { NextPage } from "next";
import { LoginBox } from "../src/module/login/LoginBox";
import { useStore } from "../src/context/store";

type InitialProps = { namespacesRequired: string[] };

const Component: NextPage<{}, InitialProps> = () => {
  const { setWithLayout } = useStore();
  setWithLayout(false);

  return <LoginBox />;
};

Component.getInitialProps = async (): Promise<InitialProps> => ({
  namespacesRequired: ["common"]
});

export default Component;
