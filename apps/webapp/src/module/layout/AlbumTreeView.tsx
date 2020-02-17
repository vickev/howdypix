//= =======================================
// GraphQL queries
//= =======================================
import gql from "graphql-tag";
import React, { ReactElement, useEffect } from "react";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import { useLazyQuery } from "@apollo/react-hooks";
import { uniqBy } from "lodash";
import {
  GetTreeQuery,
  GetTreeQueryVariables,
  GetTreeAlbums
} from "../../__generated__/schema-types";

// ========================================================================
// GraphQL queries
// ========================================================================
const GET_TREE = gql`
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
const hashCode = (s: string): number =>
  s.split("").reduce((_a, b) => {
    let a = _a;
    // eslint-disable-next-line no-bitwise
    a = (a << 5) - a + b.charCodeAt(0);
    // eslint-disable-next-line no-bitwise
    return a & a;
  }, 0);

const createKey = (album: string, source = "source"): string =>
  hashCode(source + album).toString();

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
  data: GetTreeQuery["getTree"]["albums"],
  selectedItems: { [name: string]: boolean }
): string[] => {
  const ret: string[] = [];
  data.forEach((d): void => {
    if (selectedItems[d.dir]) {
      ret.push(createKey(d.dir));
    }
    if (d.parentDir === "" && selectedItems[d.source]) {
      ret.push(d.source);
    }
  });
  return ret;
};

// ========================================================================
// Album Tree Item
// ========================================================================
interface AlbumTreeItemProps {
  tree: GetTreeQuery["getTree"]["albums"];
  item: GetTreeAlbums;
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
      nodeId={createKey(item.dir)}
      label={item.dir.replace((item.parentDir ?? "") + "/", "")}
      onClick={handleClick}
    >
      {tree
        .filter(d => d.parentDir === item.dir)
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
  source: string;
}

type DisplayedLeaves = {
  [key: string]: boolean;
};

type RawDataAlbums = GetTreeQuery["getTree"]["albums"];
type RawDataSources = GetTreeQuery["getTree"]["sources"];

export const AlbumTreeView: React.FC<TreeProps> = ({ album, source }) => {
  // ============================================
  // Hooks
  // ============================================
  // State of the Tree component to know what node ids are unfolded
  const [expandedNodeIds, setExpandedNodeIds] = React.useState<string[]>([]);

  // State of the tree fetched from the server
  const [fetchedAlbums, setAlbums] = React.useState<RawDataAlbums>();
  const [fetchedSources, setSources] = React.useState<RawDataSources>();

  // All the leaves in the tree that are currently shown
  const [visibleLeaves, setVisibleLeaves] = React.useState<DisplayedLeaves>({
    ...(album ? { [album]: true } : {}),
    [source]: true
  });

  // ============================================
  // GrapQL query callback
  // ============================================
  const [fetchTree, { data, loading, variables }] = useLazyQuery<
    GetTreeQuery,
    GetTreeQueryVariables
  >(GET_TREE);

  // ============================================
  // Effects
  // ============================================
  // If the data is fetched, we update the tree state
  useEffect(() => {
    if (data && !loading) {
      setAlbums(
        uniqBy([...(fetchedAlbums ?? []), ...data.getTree.albums], "dir")
      );

      setSources(data.getTree.sources);
    }
  }, [data, loading]);

  // If there is a new tree structure that has been fetched, we update the visible leaves
  useEffect(() => {
    if (fetchedAlbums && fetchedSources) {
      if (variables.album === album && variables.source === source) {
        setVisibleLeaves({
          ...visibleLeaves,
          ...(album ? selectParents(fetchedAlbums, album) : {}),
          [source]: true
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
    if (fetchedAlbums && visibleLeaves) {
      setExpandedNodeIds(defaultExpanded(fetchedAlbums, visibleLeaves));
    }
  }, [visibleLeaves]);

  // When we change the album, we need to re-fetch the tree from this album
  useEffect(() => {
    fetchTree({
      variables: {
        album: album ?? "",
        source
      }
    });
  }, [album]);

  // ============================================
  // Callbacks
  // ============================================
  const handleNodeToggle = (
    event: React.ChangeEvent<{}>,
    nodes: string[]
  ): void => {
    setExpandedNodeIds(nodes);
  };

  const handleAlbumClick = (item: GetTreeAlbums): void => {
    if (!visibleLeaves[item.dir]) {
      if (visibleLeaves[item.dir] === undefined) {
        fetchTree({
          variables: {
            album: item.dir,
            source: item.source
          }
        });
      }

      setVisibleLeaves({
        ...visibleLeaves,
        ...selectParents(fetchedAlbums, item.dir),
        [item.source]: true
      });
    } else {
      const newVisibleLeaves = {
        ...visibleLeaves,
        [item.dir]: false,
        [item.source]: true
      };

      if (item.parentDir) {
        newVisibleLeaves[item.parentDir] = true;
      }

      setVisibleLeaves(newVisibleLeaves);
    }
  };

  const handleSourceClick = (source: string): (() => void) => {
    return (): void => {
      if (!visibleLeaves[source]) {
        if (visibleLeaves[source] === undefined) {
          fetchTree({
            variables: {
              album: "",
              source
            }
          });
        }

        setVisibleLeaves({
          ...visibleLeaves,
          [source]: true
        });
      } else {
        setVisibleLeaves({
          ...visibleLeaves,
          [source]: false
        });
      }
    };
  };

  // ============================================
  // Render
  // ============================================
  if (fetchedAlbums && fetchedSources) {
    return (
      <TreeView expanded={expandedNodeIds} onNodeToggle={handleNodeToggle}>
        {fetchedSources.map(
          (source): ReactElement => (
            <TreeItem
              nodeId={source.name}
              label={source.name}
              onClick={handleSourceClick(source.name)}
              key={`treeitem_${source.name}`}
            >
              {fetchedAlbums
                .filter(
                  (item): boolean =>
                    item.parentDir === "" && item.source === source.name
                )
                .map(
                  (item): ReactElement => (
                    <AlbumTreeItem
                      tree={fetchedAlbums}
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
  }

  return null;
};
