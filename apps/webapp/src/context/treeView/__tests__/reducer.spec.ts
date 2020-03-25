import { reducer } from "../reducer";
import { AlbumWithNodeId, SourceWithNodeId } from "../types";

const createFakeAlbum = (
  id: number,
  sourceId: number,
  parentDirId: number | null = null,
  overrides: Partial<AlbumWithNodeId> = {}
): AlbumWithNodeId => ({
  nodeId: `album${id}`,
  dir: `album${id}`,
  parentDir: parentDirId ? `album${parentDirId}` : "",
  source: `source${sourceId}`,
  nbAlbums: 0,
  nbImages: id,
  preview: `preview${id}`,
  ...overrides,
});

const createFakeSource = (
  id: number,
  overrides: Partial<SourceWithNodeId> = {}
): SourceWithNodeId => ({
  nodeId: `source${id}`,
  name: `source${id}`,
  nbAlbums: 0,
  nbImages: id,
  preview: `preview${id}`,
  ...overrides,
});

describe("treeView reducer", () => {
  describe("for the action DATA_FETCHED", () => {
    test("must merge the fetched information in the state", async () => {
      const result = reducer(
        {
          visibleLeaves: {},
          fetchedAlbums: [createFakeAlbum(1, 2)],
          expandedNodeIds: [],
          fetchedSources: [
            createFakeSource(1, { nbAlbums: 1 }),
            createFakeSource(2, { nbAlbums: 1 }),
          ],
        },
        {
          type: "DATA_FETCHED",
          variables: { album: "album1", source: "source1" },
          sources: [
            createFakeSource(1, { nbAlbums: 1 }),
            createFakeSource(2, { nbAlbums: 1 }),
          ],
          albums: [createFakeAlbum(2, 2)],
        }
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe("for the action DISPLAY_LEAF", () => {
    test("must update the visible leaves state and the expandedNodeIds for an album", async () => {
      const { visibleLeaves, expandedNodeIds } = reducer(
        {
          visibleLeaves: {},
          fetchedAlbums: [
            createFakeAlbum(1, 1),
            createFakeAlbum(2, 1),
            createFakeAlbum(3, 1, null, { nbAlbums: 1 }),
            createFakeAlbum(4, 1, 3, { nbAlbums: 1 }),
            createFakeAlbum(5, 1, 4),
          ],
          expandedNodeIds: [],
          fetchedSources: [
            createFakeSource(1, { nbAlbums: 1 }),
            createFakeSource(2),
          ],
        },
        {
          type: "DISPLAY_LEAF",
          album: "album5",
          source: "source1",
        }
      );

      expect(visibleLeaves).toMatchSnapshot();
      expect(expandedNodeIds).toMatchSnapshot();
    });

    test("must update the visible leaves state and the expandedNodeIds for a source", async () => {
      const { visibleLeaves, expandedNodeIds } = reducer(
        {
          visibleLeaves: {},
          fetchedAlbums: [
            createFakeAlbum(1, 1),
            createFakeAlbum(2, 1),
            createFakeAlbum(3, 1, null, { nbAlbums: 1 }),
            createFakeAlbum(4, 1, 3, { nbAlbums: 1 }),
            createFakeAlbum(5, 1, 4),
          ],
          expandedNodeIds: [],
          fetchedSources: [
            createFakeSource(1, { nbAlbums: 3 }),
            createFakeSource(2),
          ],
        },
        {
          type: "DISPLAY_LEAF",
          album: "",
          source: "source1",
        }
      );

      expect(visibleLeaves).toMatchSnapshot();
      expect(expandedNodeIds).toMatchSnapshot();
    });
  });

  describe("for the action UPDATE_EXPANDED_NODE_IDS", () => {
    test("must update the expandedNodeIds", async () => {
      const { expandedNodeIds } = reducer(
        {
          visibleLeaves: {
            album1: true,
            album2: true,
            album3: true,
            source1: true,
            source2: true,
          },
          fetchedAlbums: [
            createFakeAlbum(1, 1),
            createFakeAlbum(2, 1),
            createFakeAlbum(3, 2),
          ],
          expandedNodeIds: [],
          fetchedSources: [
            createFakeSource(1, { nbAlbums: 2 }),
            createFakeSource(2, { nbAlbums: 1 }),
          ],
        },
        {
          type: "UPDATE_EXPANDED_NODE_IDS",
        }
      );

      expect(expandedNodeIds).toMatchSnapshot();
    });

    test("must update the expandedNodeIds when everything is false", async () => {
      const { expandedNodeIds } = reducer(
        {
          visibleLeaves: {
            album1: false,
            album2: false,
            album3: false,
            source1: false,
            source2: false,
          },
          fetchedAlbums: [
            createFakeAlbum(1, 1),
            createFakeAlbum(2, 1),
            createFakeAlbum(3, 2),
          ],
          expandedNodeIds: ["album1", "source1", "album2", "album3", "source2"],
          fetchedSources: [
            createFakeSource(1, { nbAlbums: 2 }),
            createFakeSource(2, { nbAlbums: 1 }),
          ],
        },
        {
          type: "UPDATE_EXPANDED_NODE_IDS",
        }
      );

      expect(expandedNodeIds).toMatchSnapshot();
    });
  });

  describe("for the action EXPAND", () => {
    test("must fetch the album if not fetched before", async () => {
      const fetchTree = jest.fn();

      reducer(
        {
          visibleLeaves: {},
          fetchedAlbums: [],
          expandedNodeIds: [],
          fetchedSources: [createFakeSource(1, { nbAlbums: 2 })],
        },
        {
          type: "EXPAND",
          source: "source1",
          album: "album1",
          fetchTree,
        }
      );

      expect(fetchTree).toHaveBeenCalledWith({
        variables: {
          album: "album1",
          source: "source1",
        },
      });
    });

    test("must fetch the source if not fetched before", async () => {
      const fetchTree = jest.fn();

      reducer(
        {
          visibleLeaves: {},
          fetchedAlbums: [],
          expandedNodeIds: [],
          fetchedSources: [createFakeSource(1, { nbAlbums: 2 })],
        },
        {
          type: "EXPAND",
          source: "source1",
          album: null,
          fetchTree,
        }
      );

      expect(fetchTree).toHaveBeenCalledWith({
        variables: {
          album: "",
          source: "source1",
        },
      });
    });

    test("must display the correct leaf if it's a source", async () => {
      const fetchTree = jest.fn();

      const { visibleLeaves } = reducer(
        {
          visibleLeaves: { source1: false, album1: false },
          fetchedAlbums: [
            createFakeAlbum(1, 1, null, { nbAlbums: 1 }),
            createFakeAlbum(1, 1, 2),
          ],
          expandedNodeIds: [],
          fetchedSources: [createFakeSource(1, { nbAlbums: 2 })],
        },
        {
          type: "EXPAND",
          source: "source1",
          album: null,
          fetchTree,
        }
      );

      expect(fetchTree).not.toHaveBeenCalled();
      expect(visibleLeaves).toMatchSnapshot();
    });

    test("must display the correct leaf if it's an album", async () => {
      const fetchTree = jest.fn();

      const { visibleLeaves } = reducer(
        {
          visibleLeaves: { source1: true, album1: false, album2: true },
          fetchedAlbums: [createFakeAlbum(1, 1)],
          expandedNodeIds: [],
          fetchedSources: [createFakeSource(1, { nbAlbums: 2 })],
        },
        {
          type: "EXPAND",
          source: "source1",
          album: "album1",
          fetchTree,
        }
      );

      expect(fetchTree).not.toHaveBeenCalled();
      expect(visibleLeaves).toMatchSnapshot();
    });
  });

  describe("for the action COLLAPSE", () => {
    test("must hide the corresponding leaves if hidding an album", async () => {
      const { visibleLeaves, expandedNodeIds } = reducer(
        {
          visibleLeaves: {
            album1: true,
            album2: true,
            album3: true,
            source1: true,
            source2: true,
          },
          fetchedAlbums: [
            createFakeAlbum(1, 1),
            createFakeAlbum(2, 1),
            createFakeAlbum(3, 2),
          ],
          expandedNodeIds: ["album1", "source1", "album2", "album3", "source2"],
          fetchedSources: [
            createFakeSource(1, { nbAlbums: 2 }),
            createFakeSource(2, { nbAlbums: 1 }),
          ],
        },
        {
          type: "COLLAPSE",
          album: "album1",
          source: "source1",
          parent: null,
        }
      );

      expect(visibleLeaves).toMatchSnapshot();
      expect(expandedNodeIds).toMatchSnapshot();
    });

    test("must hide the corresponding leaves if hiding a source", async () => {
      const { visibleLeaves, expandedNodeIds } = reducer(
        {
          visibleLeaves: {
            album1: true,
            album2: true,
            album3: true,
            source1: true,
            source2: true,
          },
          fetchedAlbums: [
            createFakeAlbum(1, 1),
            createFakeAlbum(2, 1),
            createFakeAlbum(3, 2),
          ],
          expandedNodeIds: ["album1", "source1", "album2", "album3", "source2"],
          fetchedSources: [
            createFakeSource(1, { nbAlbums: 2 }),
            createFakeSource(2, { nbAlbums: 1 }),
          ],
        },
        {
          type: "COLLAPSE",
          album: null,
          source: "source1",
          parent: null,
        }
      );

      expect(visibleLeaves).toMatchSnapshot();
      expect(expandedNodeIds).toMatchSnapshot();
    });
  });

  describe("for the action TOGGLE", () => {
    const base = {
      visibleLeaves: {
        album1: true,
        album2: true,
        album3: true,
        source1: true,
        source2: true,
      },
      fetchedAlbums: [
        createFakeAlbum(1, 1),
        createFakeAlbum(2, 1),
        createFakeAlbum(3, 2),
      ],
      expandedNodeIds: ["album1", "source1", "album2", "album3", "source2"],
      fetchedSources: [
        createFakeSource(1, { nbAlbums: 2 }),
        createFakeSource(2, { nbAlbums: 1 }),
      ],
    };

    test("must call collapse if it's visible", async () => {
      const fetchTree = jest.fn();

      const { visibleLeaves, expandedNodeIds } = reducer(base, {
        type: "TOGGLE",
        album: "album1",
        source: "source1",
        parent: null,
        fetchTree,
      });

      expect(fetchTree).not.toHaveBeenCalled();
      expect(visibleLeaves).toMatchSnapshot();
      expect(expandedNodeIds).toMatchSnapshot();
    });

    test("must call expand if it's hidden", async () => {
      const fetchTree = jest.fn();

      const { visibleLeaves, expandedNodeIds } = reducer(
        {
          ...base,
          ...{
            visibleLeaves: {
              ...base.visibleLeaves,
              ...{ album1: false, album2: false },
            },
            expandedNodeIds: ["source1", "album3", "source2"],
          },
        },
        {
          type: "TOGGLE",
          album: "album1",
          source: "source1",
          parent: null,
          fetchTree,
        }
      );

      expect(fetchTree).not.toHaveBeenCalled();
      expect(visibleLeaves).toMatchSnapshot();
      expect(expandedNodeIds).toMatchSnapshot();
    });

    test("must fetch if it's not been fetched before", async () => {
      const fetchTree = jest.fn();

      reducer(base, {
        type: "TOGGLE",
        album: "album5",
        source: "source2",
        parent: null,
        fetchTree,
      });

      expect(fetchTree).toHaveBeenCalledWith({
        variables: {
          album: "album5",
          source: "source2",
        },
      });
    });
  });
});
