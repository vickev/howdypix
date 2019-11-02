/// <reference types="Cypress" />

context("Index page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("cy.window() - get the global window object", () => {});
});
