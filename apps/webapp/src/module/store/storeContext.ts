import React from "react";

export type StoreContextData = {
  currentAlbum: string | null;
  currentSource: string | null;
  rightPanel: React.ReactElement | null;
  setCurrentAlbum: (album: StoreContextData["currentAlbum"]) => void;
  setCurrentSource: (source: StoreContextData["currentSource"]) => void;
  setRightPanel: (panel: StoreContextData["rightPanel"]) => void;
};

export const StoreContext = React.createContext<StoreContextData>({
  currentAlbum: null,
  currentSource: null,
  rightPanel: null,
  setRightPanel: () => {},
  setCurrentAlbum: () => {},
  setCurrentSource: () => {}
});

export const StoreProvider = StoreContext.Provider;
