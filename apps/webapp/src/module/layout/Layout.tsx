import React from "react";
import Box from "@material-ui/core/Box";
import { Button } from "@material-ui/core";
import { useCurrentUser, withUser } from "../../context/user";
import { useStore } from "../../context/store";
import { AlbumTreeView } from "./AlbumTreeView";
import { ExpansionPanel } from "../../component/ExpansionPanel";

// ========================================================================
// Component
// ========================================================================
interface LayoutProps {
  children: React.ReactElement;
}

const RawLayout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useCurrentUser();
  const { rightPanel } = useStore();

  return (
    <div style={{ width: "100%" }}>
      <Box display="flex" minHeight="100vh">
        <Box width={250} minHeight="100%">
          <Button onClick={logout}>{user?.name}</Button>
          <ExpansionPanel label="Albums">
            <AlbumTreeView />
          </ExpansionPanel>
        </Box>
        <Box
          flex={1}
          minHeight="100%"
          bgcolor="white"
          boxShadow={4}
          zIndex={100}
        >
          <Box height="100%">{children}</Box>
        </Box>
        <Box width={200} minHeight="100%">
          {rightPanel}
        </Box>
      </Box>
    </div>
  );
};

export const Layout = withUser(RawLayout);
