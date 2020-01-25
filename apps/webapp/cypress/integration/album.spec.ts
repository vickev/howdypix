context("Album page full", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/album/@test?fixture-set=full");
  });

  it("should display the pictures.", () => {
    cy.findAllByTestId("thumbnail").should("exist");
  });

  it("should display the sub directories.", () => {
    cy.findByText("sub-test").should("exist");
    cy.findByTestId("albumcard-image").should(
      "have.css",
      "background-image",
      'url("http://localhost:3000/static-tests/albert.jpg")'
    );
  });

  it("should re-order the images.", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const checkOrderOfImages = (orders): void => {
      cy.findAllByTestId("thumbnail").each((el, key) => {
        cy.wrap(el)
          .find(">div")
          .should(
            "have.css",
            "background-image",
            `url("http://localhost:3000/static-tests/albert.jpg?${orders[key]}")`
          );
      });
    };

    checkOrderOfImages(["id1", "id2", "id3"]);

    // Change the order
    cy.findByText("Sort By: Date").click();
    cy.findByText("Name").click();
    cy.wait(1000);
    checkOrderOfImages(["id2", "id1", "id3"]);

    // Change the order
    cy.findByTestId("orderAscDesc").click();
    cy.wait(1000);
    checkOrderOfImages(["id3", "id1", "id2"]);
  });
});

context("Album page empty", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/album/@test?fixture-set=empty");
  });

  it("should not display the pictures.", () => {
    cy.findByTestId("thumbnail").should("not.exist");
  });
  it("should display the sub directories.", () => {
    cy.findByTestId("albumcard-image").should(
      "not.have.css",
      "background-image",
      'url("http://localhost:3000/static-tests/albert.jpg")'
    );
    cy.findByText("sub-test").should("exist");
  });
});
