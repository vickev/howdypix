import React from "react";
import {
  GetTreeAlbums,
  GetTreeQuery,
  GetTreeSources
} from "../../__generated__/schema-types";

export type TreeItem = {
  album: string | null;
  source: string;
};

export type TreeItemWithParent = TreeItem & {
  parent: string | null;
};

export type RawDataAlbum = GetTreeAlbums & {
  nodeId: string;
};
export type RawDataSource = GetTreeSources & {
  nodeId: string;
};

export type RawDataAlbums = RawDataAlbum[];
export type RawDataSources = RawDataSource[];

export type TreeViewContextData = {
  expand: (item: TreeItem) => void;
  collapse: (item: TreeItemWithParent) => void;
  toggle: (item: TreeItemWithParent) => void;
  expandedNodeIds: string[];
  sources: RawDataSources;
  albums: RawDataAlbums;
};

export const TreeViewContext = React.createContext<TreeViewContextData>({
  expand: () => {},
  collapse: () => {},
  toggle: () => {},
  expandedNodeIds: [],
  sources: [],
  albums: []
});

export const TreeViewProvider = TreeViewContext.Provider;
