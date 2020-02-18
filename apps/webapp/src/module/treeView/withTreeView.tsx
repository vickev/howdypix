import React, { ComponentType, useEffect } from "react";
import gql from "graphql-tag";
import { useLazyQuery } from "@apollo/react-hooks";
import { appDebug } from "@howdypix/utils";
import { uniq, uniqBy } from "lodash";
import {
  GetTreeQuery,
  GetTreeQueryVariables
} from "../../__generated__/schema-types";
import {
  RawDataAlbums,
  RawDataSource,
  RawDataSources,
  TreeItem,
  TreeItemWithParent,
  TreeViewProvider
} from "./treeViewContext";

const debug = appDebug("withUser");

type DisplayedLeaves = {
  [key: string]: boolean;
};

//= =======================================
// GraphQL queries
//= =======================================
const GET_TREE_VIEW = gql`
  query GetTree($album: String!, $source: String!) {
    getTree(album: $album, source: $source) {
      sources {
        name
      }
      albums {
        dir
        parentDir
        source
      }
    }
  }
`;
// ========================================================================
// Utility functions
// ========================================================================
const selectParents = (
  data: GetTreeQuery["getTree"]["albums"] | null | undefined,
  dir: string
): { [key: string]: boolean } => {
  let ret: { [key: string]: boolean } = {};

  if (!data) {
    ret[dir] = true;
  } else {
    data.forEach((d): void => {
      if (d.dir === dir) {
        ret[d.dir] = true;

        if (d.parentDir) {
          ret = {
            ...ret,
            ...selectParents(data, d.parentDir)
          };
        }
      }
    });
  }

  return ret;
};

const defaultExpanded = (
  data: RawDataAlbums,
  selectedItems: { [name: string]: boolean }
): string[] => {
  const ret: string[] = [];

  data.forEach((d): void => {
    if (d.dir && selectedItems[d.dir]) {
      ret.push(d.nodeId);
    }
    if (d.parentDir === "" && selectedItems[d.source]) {
      ret.push(d.source);
    }
  });

  return uniq(ret);
};

export const withTreeView = <P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> => (props): React.ReactElement => {
  // ============================================
  // Hooks
  // ============================================
  // State of the Tree component to know what node ids are unfolded
  const [expandedNodeIds, setExpandedNodeIds] = React.useState<string[]>([]);

  // State of the tree fetched from the server
  const [fetchedAlbums, setAlbums] = React.useState<RawDataAlbums>();
  const [fetchedSources, setSources] = React.useState<RawDataSources>();

  // All the leaves in the tree that are currently shown
  const [visibleLeaves, setVisibleLeaves] = React.useState<DisplayedLeaves>({});

  // ============================================
  // GrapQL query callback
  // ============================================
  const [fetchTree, { data, loading, variables }] = useLazyQuery<
    GetTreeQuery,
    GetTreeQueryVariables
  >(GET_TREE_VIEW);

  // ============================================
  // Effects
  // ============================================
  // If the data is fetched, we update the tree state
  useEffect(() => {
    if (data && !loading) {
      setAlbums(
        uniqBy([...(fetchedAlbums ?? []), ...data.getTree.albums], "dir").map(
          album => ({
            ...album,
            nodeId: album.source + album.dir
          })
        )
      );

      setSources(
        data.getTree.sources.map(
          (source): RawDataSource => ({
            ...source,
            nodeId: source.name
          })
        )
      );
    }
  }, [data, loading]);

  // If there is a new tree structure that has been fetched, we update the visible leaves
  useEffect(() => {
    if (fetchedAlbums && fetchedSources) {
      if (variables.album !== "") {
        setVisibleLeaves({
          ...visibleLeaves,
          ...selectParents(fetchedAlbums, variables.album),
          [variables.source]: true
        });
      } else if (variables.album === "") {
        setVisibleLeaves({
          ...visibleLeaves,
          [variables.source]: true
        });
      }
    }
  }, [fetchedAlbums, fetchedSources]);

  // When we change the visible leaves, we update the structure in the UI Tree View
  useEffect(() => {
    if (fetchedAlbums) {
      setExpandedNodeIds(defaultExpanded(fetchedAlbums, visibleLeaves));
    }
  }, [visibleLeaves]);

  const expand = (item: TreeItem): void => {
    if (item.album === null) {
      if (visibleLeaves[item.source] === undefined) {
        fetchTree({
          variables: {
            album: "",
            source: item.source
          }
        });
      }
    } else if (visibleLeaves[item.album] === undefined) {
      fetchTree({
        variables: {
          album: item.album ?? "",
          source: item.source
        }
      });
    }

    setVisibleLeaves({
      ...visibleLeaves,
      ...(item.album ? selectParents(fetchedAlbums, item.album) : {}),
      [item.source]: true
    });
  };

  const collapse = (item: TreeItemWithParent): void => {
    const newVisibleLeaves = {
      ...visibleLeaves,
      [item.source]: true
    };

    if (item.album !== null) {
      newVisibleLeaves[item.album] = false;
    } else {
      newVisibleLeaves[item.source] = false;
    }

    if (item.parent) {
      newVisibleLeaves[item.parent] = true;
    }

    console.log(newVisibleLeaves);

    setVisibleLeaves(newVisibleLeaves);
  };

  const toggle = (item: TreeItemWithParent): void => {
    if (item.album !== null) {
      if (visibleLeaves[item.album]) {
        collapse(item);
      } else {
        expand(item);
      }
    } else if (visibleLeaves[item.source]) {
      collapse(item);
    } else {
      expand(item);
    }
  };

  return (
    <TreeViewProvider
      value={{
        expand,
        collapse,
        toggle,
        expandedNodeIds,
        sources: fetchedSources ?? [],
        albums: fetchedAlbums ?? []
      }}
    >
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <WrappedComponent {...props} />
    </TreeViewProvider>
  );
};
