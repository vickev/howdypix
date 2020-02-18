//= =======================================
// GraphQL queries
//= =======================================
import React, { ReactElement } from "react";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import { GetTreeAlbums } from "../../__generated__/schema-types";
import { withTreeView } from "../treeView/withTreeView";
import { useTreeView } from "../treeView/treeViewHook";
import { RawDataAlbum, RawDataAlbums } from "../treeView/treeViewContext";
import { useStore } from "../store/storeHook";

// ========================================================================
// Album Tree Item
// ========================================================================
interface AlbumTreeItemProps {
  tree: RawDataAlbums;
  item: RawDataAlbum;
  onClick: (item: GetTreeAlbums) => void;
}

const AlbumTreeItem: React.FC<AlbumTreeItemProps> = ({
  tree,
  item,
  onClick
}) => {
  const handleClick = (): void => {
    onClick(item);
  };

  return (
    <TreeItem
      nodeId={item.nodeId}
      label={item.dir.replace((item.parentDir ?? "") + "/", "")}
      onClick={handleClick}
    >
      {tree
        .filter(d => d.parentDir === item.dir && item.dir !== "")
        .map(d => (
          <AlbumTreeItem
            tree={tree}
            item={d}
            onClick={onClick}
            key={`albumtreeitem_${d.dir}`}
          />
        ))}
    </TreeItem>
  );
};

// ========================================================================
// Album Tree View
// ========================================================================
interface TreeProps {
  album?: string;
  source?: string;
}

// eslint-disable-next-line no-underscore-dangle
const _AlbumTreeView: React.FC<TreeProps> = ({ album, source }) => {
  // ============================================
  // Hooks
  // ============================================
  // Load the general store of the app
  const { currentSource, currentAlbum } = useStore();

  const { sources, albums, expandedNodeIds, toggle } = useTreeView({
    album: currentAlbum ?? undefined,
    source: currentSource ?? undefined
  });

  // ============================================
  // Callbacks
  // ============================================
  const handleAlbumClick = (item: GetTreeAlbums): void => {
    toggle({
      album: item.dir,
      parent: item.parentDir ?? null,
      source: item.source
    });
  };

  const handleSourceClick = (source: string): (() => void) => {
    return (): void => {
      toggle({
        album: null,
        parent: null,
        source
      });
    };
  };

  // ============================================
  // Render
  // ============================================
  return (
    <TreeView expanded={expandedNodeIds}>
      {sources.map(
        (source): ReactElement => (
          <TreeItem
            nodeId={source.nodeId}
            label={source.name}
            onClick={handleSourceClick(source.name)}
            key={`treeitem_${source.name}`}
          >
            {albums
              .filter(
                (item): boolean =>
                  item.parentDir === "" && item.source === source.name
              )
              .map(
                (item): ReactElement => (
                  <AlbumTreeItem
                    tree={albums}
                    item={item}
                    onClick={handleAlbumClick}
                    key={`albumtreeitem_toplevel_${item.dir}`}
                  />
                )
              )}
          </TreeItem>
        )
      )}
    </TreeView>
  );
};

export const AlbumTreeView = withTreeView(_AlbumTreeView);
