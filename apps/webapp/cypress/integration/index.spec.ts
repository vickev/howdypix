/// <reference types="Cypress" />

context("Index page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/?fixture-set=full");
  });

  it("should display the pictures.", () => {
    cy.findAllByAltText("image").should("exist");
  });
});
