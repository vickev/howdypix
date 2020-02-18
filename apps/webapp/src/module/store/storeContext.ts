import React from "react";

export type StoreContextData = {
  currentAlbum: string | null;
  currentSource: string | null;
  setCurrentAlbum: (album: StoreContextData["currentAlbum"]) => void;
  setCurrentSource: (source: StoreContextData["currentSource"]) => void;
};

export const StoreContext = React.createContext<StoreContextData>({
  currentAlbum: null,
  currentSource: null,
  setCurrentAlbum: () => {},
  setCurrentSource: () => {}
});

export const StoreProvider = StoreContext.Provider;
