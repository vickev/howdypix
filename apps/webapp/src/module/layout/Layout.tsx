import React from "react";
import Box from "@material-ui/core/Box";
import { Button, Container } from "@material-ui/core";
import { useCurrentUser } from "../user/userHook";
import { withUser } from "../user/withUser";

interface LayoutProps {
  leftComponent?: React.ReactElement;
  rightComponent?: React.ReactElement;
  children: React.ReactElement;
}

const RawLayout: React.FC<LayoutProps> = ({
  leftComponent,
  // rightComponent,
  children
}) => {
  const { user, logout } = useCurrentUser();

  return (
    <>
      <Container>
        <Box display="flex" minHeight="100vh">
          <Box width={200} minHeight="100%">
            <Button onClick={logout}>{user?.name}</Button>
            {leftComponent}
          </Box>
          <Box flex={1} minHeight="100%" bgcolor="white" boxShadow={1}>
            {children}
          </Box>
          {/* <Box width={200}>{rightComponent}</Box> */}
        </Box>
      </Container>
    </>
  );
};

export const Layout = withUser(RawLayout);
