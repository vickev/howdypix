import React, { ComponentType, useState } from "react";
import { appDebug } from "@howdypix/utils";
import { StoreProvider } from "./storeContext";

const debug = appDebug("withStore");

export const withStore = <P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> => (props): React.ReactElement => {
  const [currentAlbum, setCurrentAlbum] = useState<string | null>(null);
  const [currentSource, setCurrentSource] = useState<string | null>(null);

  return (
    <StoreProvider
      value={{
        currentSource,
        currentAlbum,
        setCurrentSource,
        setCurrentAlbum
      }}
    >
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <WrappedComponent {...props} />
    </StoreProvider>
  );
};
