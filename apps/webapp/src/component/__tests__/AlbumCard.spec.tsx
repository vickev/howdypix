import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { AlbumCard } from "../AlbumCard";

describe("AlbumCard", () => {
  test("must display the name, the number of photos and albums", async () => {
    const { findByText, container } = render(
      <AlbumCard
        source="."
        dir="dir"
        name="name"
        preview="preview"
        nbAlbums={111}
        nbPhotos={222}
      />
    );

    expect(await findByText("name")).toBeVisible();
    expect(container).toHaveTextContent(/111/);
    expect(container).toHaveTextContent(/222/);
  });
  test("must display the image passed in the preview attribute", async () => {
    const { findByTestId } = render(
      <AlbumCard source="." dir="dir" name="name" preview="preview" />
    );

    expect(await findByTestId("albumcard-image")).toHaveStyle(
      "background-image: url('preview')"
    );
  });

  test("must display an icon if no image preview", async () => {
    const { container } = render(
      <AlbumCard source="." dir="dir" name="name" />
    );

    expect(container.querySelector("svg")).toBeVisible();
  });
});
