context("Album page full with filters", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/album/@test?fixture-set=filters");
  });

  it("should apply the filters.", async () => {
    cy.findAllByTestId("thumbnail").should("exist");
    cy.findAllByTestId("thumbnail").should("have.length", 3);

    cy.get("body").contains("Camera Make").click();

    cy.findByText("make 1").click();
    cy.findAllByTestId("thumbnail").should("have.length", 2);

    cy.findByText("make 2").click();
    cy.findAllByTestId("thumbnail").should("have.length", 1);
  });

  it.only("should update the URL according to the filter and order.", () => {
    cy.findAllByTestId("thumbnail").should("exist");

    //= ===============================================
    // Change the order
    //= ===============================================
    cy.get("body").contains("Sort By: Date").click();
    cy.findByText("Name").click();

    //= ===============================================
    // Change the filter
    //= ===============================================
    cy.get("body").contains("Camera Make").click();

    cy.findByText("make 1").click();
    cy.findByText("make 1").click();
    cy.findByText("make 2").click();

    //= ===============================================
    // Assert
    //= ===============================================
    cy.url().should("include", "make=make%201");
    cy.url().should("include", "make=make%202");
    cy.url().should("include", "order=NAME_ASC");
  });

  it("should re-order the images.", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const checkOrderOfImages = (orders) => {
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
    cy.get("body").contains("Sort By: Date").click();
    cy.findByText("Name").click();
    cy.wait(1000);
    checkOrderOfImages(["id2", "id1", "id3"]);
    cy.url().should("include", "order=NAME_ASC");

    // Change the order
    cy.get("[data-testid=orderAscDesc]").click();
    cy.wait(1000);
    checkOrderOfImages(["id3", "id1", "id2"]);
    cy.url().should("include", "order=NAME_DESC");
  });
});
