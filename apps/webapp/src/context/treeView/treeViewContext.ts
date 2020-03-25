import React from "react";
import { TreeViewContextData } from "./types";

export const TreeViewContext = React.createContext<TreeViewContextData>({
  expand: () => {},
  collapse: () => {},
  toggle: () => {},
  expandedNodeIds: [],
  sources: [],
  albums: [],
});

export const TreeViewProvider = TreeViewContext.Provider;
