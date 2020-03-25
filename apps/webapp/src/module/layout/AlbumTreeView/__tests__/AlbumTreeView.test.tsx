/**
 * DISCLAMER!!!!!
 * I'm keeping this test as an example of how to test a complex component
 * with React Testing Lib, but the setup is so big with the Providers that it's not worth.
 * We prefer to write Cypress e2e tests, where the setup is much easier!
 */
import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ThemeProvider } from "styled-components";
import { AlbumTreeView } from "../AlbumTreeView";
import { TreeViewProvider } from "../../../../context/treeView";
import {
  AlbumWithNodeId,
  SourceWithNodeId,
  TreeViewContextData,
} from "../../../../context/treeView/types";
import { StoreProvider } from "../../../../context/store";
import theme from "../../../../theme";

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

describe("AlbumTreeView", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // (reducer as jest.MockedFunction<any>).mockClear();
  });

  test("must render the tree.", async () => {
    const expand = jest.fn();
    const collapse = jest.fn();
    const toggle = jest.fn();
    const expandedNodeIds: TreeViewContextData["expandedNodeIds"] = [
      "source1",
      "album1",
      "album2",
    ];
    const sources: TreeViewContextData["sources"] = [
      createFakeSource(1, { nbAlbums: 6 }),
      createFakeSource(2),
    ];
    const albums: TreeViewContextData["albums"] = [
      createFakeAlbum(1, 1, null, { nbAlbums: 0 }),
      createFakeAlbum(2, 1, null, { nbAlbums: 2 }),
      createFakeAlbum(3, 1, null, { nbAlbums: 0 }),
      createFakeAlbum(4, 1, 2, { nbAlbums: 1 }),
      createFakeAlbum(5, 1, 2, { nbAlbums: 0 }),
      createFakeAlbum(6, 1, 4, { nbAlbums: 0 }),
    ];

    const currentSource = null;
    const currentAlbum = null;
    const rightPanel = null;
    const withLayout = false;
    const setCurrentSource = jest.fn();
    const setCurrentAlbum = jest.fn();
    const setRightPanel = jest.fn();
    const setWithLayout = jest.fn();

    const { findByTestId, queryByTestId } = render(
      <ThemeProvider theme={theme}>
        <StoreProvider
          value={{
            currentSource,
            currentAlbum,
            rightPanel,
            withLayout,
            setCurrentSource,
            setCurrentAlbum,
            setRightPanel,
            setWithLayout,
          }}
        >
          <TreeViewProvider
            value={{
              expand,
              collapse,
              toggle,
              expandedNodeIds,
              sources,
              albums,
            }}
          >
            <AlbumTreeView />
          </TreeViewProvider>
        </StoreProvider>
      </ThemeProvider>
    );

    expect(await findByTestId(`treeitem toggle source1`)).toBeVisible();
    expect(await findByTestId(`treeitem toggle album1`)).toBeVisible();
    expect(await findByTestId(`treeitem toggle album2`)).toBeVisible();
    expect(await findByTestId(`treeitem toggle album3`)).toBeVisible();
    expect(await findByTestId(`treeitem toggle album4`)).toBeVisible();
    expect(await findByTestId(`treeitem toggle album5`)).toBeVisible();
    expect(await queryByTestId(`treeitem toggle album6`)).toBeNull();
  });
});
