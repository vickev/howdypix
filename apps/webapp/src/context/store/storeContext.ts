import React from "react";
import { StoreContextData } from "./types";

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
