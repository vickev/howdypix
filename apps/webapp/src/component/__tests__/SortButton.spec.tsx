import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { SortButton } from "../SortButton";

describe("SortButton", () => {
  test("must display the buttons", async () => {
    const { findByText } = render(
      <SortButton value="NAME_ASC" onChange={(): void => {}} />
    );

    expect(await findByText("sort_by")).toBeVisible();
  });

  test("should call the callback when the sorting changes", async () => {
    const callback = jest.fn();
    const { findByText, findByTestId } = render(
      <SortButton value="NAME_ASC" onChange={callback} />
    );

    (await findByText("sort_by")).click();
    (await findByText("Date")).click();
    expect(callback).toHaveBeenCalledWith("DATE_ASC");

    (await findByTestId("orderAscDesc")).click();
    expect(callback).toHaveBeenCalledWith("NAME_DESC");
  });
});
