/// <reference types="Cypress" />

context("Index page", () => {
  beforeEach(() => {
    cy.visit("/?fixture-set=full");
  });

  it("should display the pictures.", () => {
    cy.findAllByAltText("image").should("exist");
  });
});
