import React from "react";
import { GetTreeAlbums } from "../../../__generated__/schema-types";
import { AlbumWithNodeId } from "../../../context/treeView";
import { useStore } from "../../../context/store";
import { StyledTreeItem } from "./StyledTreeItem";

// ========================================================================
// Component
// ========================================================================
type AlbumTreeItemProps = {
  tree: AlbumWithNodeId[];
  item: AlbumWithNodeId;
  onClickExpand: (item: GetTreeAlbums) => void;
  onClickItem: (item: GetTreeAlbums) => void;
};

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

  const labelText = item.dir.replace(`${item.parentDir ?? ""}/`, "");

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
