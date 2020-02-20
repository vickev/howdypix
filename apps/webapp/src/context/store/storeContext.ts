import React from "react";

export type StoreContextData = {
  currentAlbum: string | null;
  currentSource: string | null;
  withLayout: boolean;
  rightPanel: React.ReactElement | null;
  setCurrentAlbum: (album: StoreContextData["currentAlbum"]) => void;
  setCurrentSource: (source: StoreContextData["currentSource"]) => void;
  setRightPanel: (panel: StoreContextData["rightPanel"]) => void;
  setWithLayout: (panel: StoreContextData["withLayout"]) => void;
};

export const StoreContext = React.createContext<StoreContextData>({
  withLayout: true,
  currentAlbum: null,
  currentSource: null,
  rightPanel: null,
  setRightPanel: () => {},
  setCurrentAlbum: () => {},
  setCurrentSource: () => {},
  setWithLayout: () => {}
});

export const StoreProvider = StoreContext.Provider;
