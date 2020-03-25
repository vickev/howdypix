import { uniq, uniqBy } from "lodash";
import { QueryLazyOptions } from "@apollo/react-hooks";
import {
  GetTreeAlbums,
  GetTreeQuery,
  GetTreeQueryVariables,
  GetTreeSources,
} from "../../__generated__/schema-types";
import {
  AlbumWithNodeId,
  SourceWithNodeId,
  TreeItem,
  TreeItemWithParent,
} from "./types";

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
            ...selectParents(data, d.parentDir),
          };
        }
      }
    });
  }

  return ret;
};

const calculateExpandedNodeIds = (
  data: AlbumWithNodeId[],
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

// ========================================================================
// Types
// ========================================================================
export type State = {
  fetchedAlbums: AlbumWithNodeId[];
  fetchedSources: SourceWithNodeId[];
  visibleLeaves: {
    [key: string]: boolean;
  };
  expandedNodeIds: string[];
};

export type Actions =
  | {
      type: "DATA_FETCHED";
      albums: GetTreeAlbums[];
      sources: GetTreeSources[];
      variables: {
        album: string;
        source: string;
      };
    }
  | {
      type: "DISPLAY_LEAF";
      album: string;
      source: string;
    }
  | {
      type: "UPDATE_EXPANDED_NODE_IDS";
    }
  | (TreeItem & {
      type: "EXPAND";
      fetchTree: (
        options?: QueryLazyOptions<GetTreeQueryVariables> | undefined
      ) => void;
    })
  | (TreeItemWithParent & {
      type: "COLLAPSE";
    })
  | (TreeItemWithParent & {
      type: "TOGGLE";
      fetchTree: (
        options?: QueryLazyOptions<GetTreeQueryVariables> | undefined
      ) => void;
    });

// ========================================================================
// Reducer
// ========================================================================
export const reducer = (state: State, action: Actions): State => {
  let newState: State = state;

  switch (action.type) {
    case "DATA_FETCHED":
      newState = {
        ...newState,
        fetchedSources: uniqBy(
          [...(newState.fetchedSources ?? []), ...action.sources],
          "name"
        ).map(
          (source): SourceWithNodeId => ({
            ...source,
            nodeId: source.name,
          })
        ),
        fetchedAlbums: uniqBy(
          [...(newState.fetchedAlbums ?? []), ...action.albums],
          "dir"
        ).map((album) => ({
          ...album,
          nodeId: album.source + album.dir,
        })),
      };

      return reducer(newState, {
        type: "DISPLAY_LEAF",
        source: action.variables.source,
        album: action.variables.album,
      });

    case "DISPLAY_LEAF":
      return reducer(
        {
          ...newState,
          visibleLeaves: {
            ...newState.visibleLeaves,
            ...(action.album !== ""
              ? selectParents(newState.fetchedAlbums, action.album)
              : {}),
            [action.source]: true,
          },
        },
        { type: "UPDATE_EXPANDED_NODE_IDS" }
      );

    case "UPDATE_EXPANDED_NODE_IDS":
      return {
        ...newState,
        expandedNodeIds: calculateExpandedNodeIds(
          newState.fetchedAlbums,
          newState.visibleLeaves
        ),
      };

    case "EXPAND":
      if (action.album === null) {
        if (newState.visibleLeaves[action.source] === undefined) {
          action.fetchTree({
            variables: {
              album: "",
              source: action.source,
            },
          });
        }
      } else if (newState.visibleLeaves[action.album] === undefined) {
        action.fetchTree({
          variables: {
            album: action.album ?? "",
            source: action.source,
          },
        });
      }

      // different than original
      return reducer(
        reducer(newState, {
          type: "DISPLAY_LEAF",
          source: action.source,
          album: action.album ?? "",
        }),
        { type: "UPDATE_EXPANDED_NODE_IDS" }
      );

    case "COLLAPSE":
      return reducer(
        {
          ...newState,
          visibleLeaves: {
            ...newState.visibleLeaves,
            ...(action.album !== null
              ? { [action.album]: false }
              : { [action.source]: false }),
            ...(action.parent ? { [action.parent]: true } : {}),
          },
        },
        { type: "UPDATE_EXPANDED_NODE_IDS" }
      );

    case "TOGGLE":
      if (action.album !== null) {
        if (newState.visibleLeaves[action.album]) {
          return reducer(newState, {
            ...action,
            type: "COLLAPSE",
          });
        }

        return reducer(newState, {
          ...action,
          type: "EXPAND",
        });
      }

      if (newState.visibleLeaves[action.source]) {
        return reducer(newState, {
          ...action,
          type: "COLLAPSE",
        });
      }

      return reducer(newState, {
        ...action,
        type: "EXPAND",
      });

    default:
      return newState;
  }
};
