import React from "react";
import Box from "@material-ui/core/Box";
import { Button } from "@material-ui/core";
import { useCurrentUser } from "../user/userHook";
import { withUser } from "../user/withUser";
import { AlbumTreeView } from "./AlbumTreeView";
import { withStore } from "../store/withStore";
import { useStore } from "../store/storeHook";

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
  const { currentSource, currentAlbum } = useStore();

  return (
    <div style={{ width: "100%" }}>
      <Box display="flex" minHeight="100vh">
        <Box width={200} minHeight="100%" p={2}>
          <Button onClick={logout}>{user?.name}</Button>
          <AlbumTreeView
            source={currentSource ?? undefined}
            album={currentAlbum ?? undefined}
          />
          {leftComponent}
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
          {rightComponent}
        </Box>
      </Box>
    </div>
  );
};

export const AppLayout = withUser(RawLayout);
