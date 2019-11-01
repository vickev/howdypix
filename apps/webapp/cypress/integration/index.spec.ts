/// <reference types="Cypress" />

context("Index page", () => {
  beforeEach(() => {
    cy.task("getSchema").then(schema => {
      const fixture = {
        albums: [{ dir: "dir", name: "name", source: "cats" }],
        photos: [{ id: "id1", thumbnails: ["thumb1"] }]
      };

      cy.server();
      cy.mockGraphql({
        schema,
        operations: fixture
      });
      cy.visit("http://localhost:3000");
    });
  });

  it("cy.window() - get the global window object", () => {});
});
