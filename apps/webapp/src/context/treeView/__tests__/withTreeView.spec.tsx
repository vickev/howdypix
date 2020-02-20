import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { withTreeView } from "../withTreeView";
import { useTreeView } from "../treeViewHook";
import { reducer } from "../reducer";
import { TreeViewContextData } from "../types";

jest.mock("../reducer", () => ({
  reducer: jest.fn(() => ({
    fetchedAlbums: [],
    fetchedSources: [],
    visibleLeaves: {},
    expandedNodeIds: []
  }))
}));

const testHook = async (
  callback: (contextData: TreeViewContextData) => void
): Promise<void> => {
  const Component: React.FC<{}> = () => {
    const hook = useTreeView({ album: "album1", source: "source1" });

    return (
      <button type="button" onClick={(): void => callback(hook)}>
        button
      </button>
    );
  };

  const WrappedComponent = withTreeView(Component);

  const { findByText } = render(<WrappedComponent />);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (reducer as jest.MockedFunction<any>).mockClear();

  (await findByText("button")).click();
};

describe("withTreeView", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (reducer as jest.MockedFunction<any>).mockClear();
  });

  test("must call the COLLAPSE type in the reducer.", async () => {
    await testHook(({ collapse }) => {
      collapse({ source: "source2", album: "album2", parent: null });
    });

    expect(reducer).toHaveBeenCalled();
    expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (reducer as jest.MockedFunction<any>).mock.calls[0][1]
    ).toMatchSnapshot();
  });

  test("must call the EXPAND type in the reducer.", async () => {
    await testHook(({ expand }) => {
      expand({ source: "source2", album: "album2" });
    });

    expect(reducer).toHaveBeenCalled();
    expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (reducer as jest.MockedFunction<any>).mock.calls[0][1]
    ).toMatchSnapshot();
  });

  test("must call the TOGGLE type in the reducer.", async () => {
    await testHook(({ toggle }) => {
      toggle({ source: "source2", album: "album2", parent: null });
    });

    expect(reducer).toHaveBeenCalled();
    expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (reducer as jest.MockedFunction<any>).mock.calls[0][1]
    ).toMatchSnapshot();
  });
});
