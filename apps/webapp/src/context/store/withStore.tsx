import React, { ComponentType, useState } from "react";
import { StoreProvider } from "./storeContext";

export const withStore = <P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> => (props): React.ReactElement => {
  const [currentAlbum, setCurrentAlbum] = useState<string | null>(null);
  const [currentSource, setCurrentSource] = useState<string | null>(null);
  const [rightPanel, setRightPanel] = useState<React.ReactElement | null>(null);
  const [withLayout, setWithLayout] = useState<boolean>(true);

  return (
    <StoreProvider
      value={{
        currentSource,
        currentAlbum,
        rightPanel,
        withLayout,
        setCurrentSource,
        setCurrentAlbum,
        setRightPanel,
        setWithLayout
      }}
    >
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <WrappedComponent {...props} />
    </StoreProvider>
  );
};
