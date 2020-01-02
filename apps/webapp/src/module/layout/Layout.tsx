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
  rightComponent,
  children
}) => {
  const { user, logout } = useCurrentUser();

  return (
    <div style={{ width: "100%" }}>
      <Box display="flex" minHeight="100vh">
        <Box width={200} minHeight="100%" p={2}>
          <Button onClick={logout}>{user?.name}</Button>
          {leftComponent}
        </Box>
        <Box
          flex={1}
          minHeight="100%"
          bgcolor="white"
          boxShadow={4}
          zIndex={100}
        >
          <Container>{children}</Container>
        </Box>
        <Box width={200} minHeight="100%">
          {rightComponent}
        </Box>
      </Box>
    </div>
  );
};

export const Layout = withUser(RawLayout);
