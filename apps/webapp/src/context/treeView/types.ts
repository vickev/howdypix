import {
  GetTreeAlbums,
  GetTreeSources,
} from "../../__generated__/schema-types";

export type TreeItem = {
  album: string | null;
  source: string;
};

export type TreeItemWithParent = TreeItem & {
  parent: string | null;
};

export type AlbumWithNodeId = GetTreeAlbums & {
  nodeId: string;
};
export type SourceWithNodeId = GetTreeSources & {
  nodeId: string;
};

export type TreeViewContextData = {
  expand: (item: TreeItem) => void;
  collapse: (item: TreeItemWithParent) => void;
  toggle: (item: TreeItemWithParent) => void;
  expandedNodeIds: string[];
  sources: SourceWithNodeId[];
  albums: AlbumWithNodeId[];
};
