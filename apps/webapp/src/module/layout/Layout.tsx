import React from "react";
import Box from "@material-ui/core/Box";
import { styled } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

interface LayoutProps {
  leftComponent?: React.ReactElement;
  rightComponent?: React.ReactElement;
  children: React.ReactElement;
}

export const Layout: React.FC<LayoutProps> = ({
  leftComponent,
  rightComponent,
  children
}) => {
  return (
    <>
      <Container>
        <Box display="flex" minHeight={"100vh"}>
          <Box width={200} minHeight={"100%"}>
            {leftComponent}
          </Box>
          <Box flex={1} minHeight={"100%"} bgcolor={"white"} boxShadow={1}>
            {children}
          </Box>
          {/*<Box width={200}>{rightComponent}</Box>*/}
        </Box>
      </Container>
    </>
  );
};