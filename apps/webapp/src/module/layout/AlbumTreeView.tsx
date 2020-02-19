//= =======================================
// GraphQL queries
//= =======================================
import React, { ReactElement } from "react";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import Box from "@material-ui/core/Box";
import { GetTreeAlbums } from "../../__generated__/schema-types";
import { withTreeView } from "../treeView/withTreeView";
import { useTreeView } from "../treeView/treeViewHook";
import { useStore } from "../store/storeHook";
import { AlbumTreeItem } from "./AlbumTreeItem";
import { StyledTreeItem } from "./StyledTreeItem";
import { removeEmptyValues } from "@howdypix/utils";
import { useRouter } from "next/router";
import styled from "styled-components";

const StyledTreeView = styled(TreeView)`
  width: 100%;
  flex: 1;
`;

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
  const router = useRouter();

  // Load the general store of the app
  const { currentSource, currentAlbum } = useStore();

  const { sources, albums, expandedNodeIds, toggle } = useTreeView({
    album: currentAlbum ?? undefined,
    source: currentSource ?? undefined
  });

  // ============================================
  // Callbacks
  // ============================================
  const handleAlbumClickExpand = (item: GetTreeAlbums): void => {
    toggle({
      album: item.dir,
      parent: item.parentDir ?? null,
      source: item.source
    });
  };

  const handleAlbumClickItem = (item: GetTreeAlbums): void => {
    router.push("/album/[...slug]", {
      pathname: `/album/@${item.source}:${item.dir}`
    });
  };

  const handleSourceClickItem = (source: string): (() => void) => {
    return (): void => {
      router.push("/album/[...slug]", {
        pathname: `/album/@${source}:.`
      });
    };
  };

  const handleSourceClickExpand = (source: string): (() => void) => {
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
    <Box mx={-2} flex={1}>
      <StyledTreeView expanded={expandedNodeIds}>
        {sources.map(
          (source): ReactElement => (
            <StyledTreeItem
              nodeId={source.nodeId}
              label={source.name}
              preview={source.preview}
              nbImages={source.nbImages}
              nbAlbums={source.nbAlbums}
              onClickExpand={handleSourceClickExpand(source.name)}
              onClickItem={handleSourceClickItem(source.name)}
              selected={source.name === currentSource && !currentAlbum}
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
                      onClickExpand={handleAlbumClickExpand}
                      onClickItem={handleAlbumClickItem}
                      key={`albumtreeitem_toplevel_${item.dir}`}
                    />
                  )
                )}
            </StyledTreeItem>
          )
        )}
      </StyledTreeView>
    </Box>
  );
};

export const AlbumTreeView = withTreeView(_AlbumTreeView);
