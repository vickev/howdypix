import React, { ComponentType, Reducer, useEffect, useReducer } from "react";
import gql from "graphql-tag";
import { useLazyQuery } from "@apollo/react-hooks";
import {
  GetTreeQuery,
  GetTreeQueryVariables,
} from "../../__generated__/schema-types";
import { TreeViewProvider } from "./treeViewContext";
import { TreeItem, TreeItemWithParent } from "./types";
import { Actions, reducer, State } from "./reducer";

//= =======================================
// GraphQL queries
//= =======================================
const GET_TREE_VIEW = gql`
  query GetTree($album: String!, $source: String!) {
    getTree(album: $album, source: $source) {
      sources {
        name
        preview
        nbImages
        nbAlbums
      }
      albums {
        dir
        parentDir
        source
        preview
        nbImages
        nbAlbums
      }
    }
  }
`;

export const withTreeView = <P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> => (props): React.ReactElement => {
  // ============================================
  // Hooks
  // ============================================
  const [state, dispatch] = useReducer<Reducer<State, Actions>>(reducer, {
    fetchedAlbums: [],
    fetchedSources: [],
    visibleLeaves: {},
    expandedNodeIds: [],
  });

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
      dispatch({
        type: "DATA_FETCHED",
        variables,
        albums: data.getTree.albums,
        sources: data.getTree.sources,
      });
    }
  }, [data, loading]);

  const expand = (item: TreeItem): void => {
    dispatch({
      type: "EXPAND",
      ...item,
      fetchTree,
    });
  };

  const collapse = (item: TreeItemWithParent): void => {
    dispatch({
      type: "COLLAPSE",
      ...item,
    });
  };

  const toggle = (item: TreeItemWithParent): void => {
    dispatch({
      type: "TOGGLE",
      ...item,
      fetchTree,
    });
  };

  return (
    <TreeViewProvider
      value={{
        expand,
        collapse,
        toggle,
        expandedNodeIds: state.expandedNodeIds,
        sources: state.fetchedSources,
        albums: state.fetchedAlbums,
      }}
    >
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <WrappedComponent {...props} />
    </TreeViewProvider>
  );
};
