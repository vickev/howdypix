import * as React from "react";
import { LoginBox } from "../src/module/login/LoginBox";

function Component() {
  return <LoginBox />;
}

Component.getInitialProps = async () => ({
  namespacesRequired: ["common"]
});

export default Component;
