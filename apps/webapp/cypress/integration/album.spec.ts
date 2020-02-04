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
