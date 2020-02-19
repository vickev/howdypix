//= =======================================
// GraphQL queries
//= =======================================
import React from "react";
import TreeItem from "@material-ui/lab/TreeItem";
import { GetTreeAlbums } from "../../__generated__/schema-types";
import { RawDataAlbum, RawDataAlbums } from "../treeView/treeViewContext";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { StyledTreeItem } from "./StyledTreeItem";
import { useStore } from "../store/storeHook";

// ========================================================================
// Album Tree Item
// ========================================================================
interface AlbumTreeItemProps {
  tree: RawDataAlbums;
  item: RawDataAlbum;
  onClickExpand: (item: GetTreeAlbums) => void;
  onClickItem: (item: GetTreeAlbums) => void;
}

export const AlbumTreeItem: React.FC<AlbumTreeItemProps> = ({
  tree,
  item,
  onClickExpand,
  onClickItem
}) => {
  const { currentSource, currentAlbum } = useStore();

  const handleClickExpand = (): void => {
    onClickExpand(item);
  };

  const handleClickItem = (): void => {
    onClickItem(item);
  };

  const labelText = item.dir.replace((item.parentDir ?? "") + "/", "");

  return (
    <StyledTreeItem
      nodeId={item.nodeId}
      onClickExpand={handleClickExpand}
      onClickItem={handleClickItem}
      label={labelText}
      preview={item.preview}
      nbImages={item.nbImages}
      nbAlbums={item.nbAlbums}
      selected={item.source === currentSource && item.dir === currentAlbum}
    >
      {tree
        .filter(d => d.parentDir === item.dir && item.dir !== "")
        .map(d => (
          <AlbumTreeItem
            tree={tree}
            item={d}
            onClickExpand={onClickExpand}
            onClickItem={onClickItem}
            key={`albumtreeitem_${d.dir}`}
          />
        ))}
    </StyledTreeItem>
  );
};
