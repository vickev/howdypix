/// <reference types="Cypress" />

context("Album page full", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/album/@test?fixture-set=full");
  });

  it("should display the pictures.", () => {
    cy.get("#pictureBox");
    cy.get("img").should("exist");
  });

  it("should display the sub directories.", () => {
    cy.get("#subAlbumBox .MuiBox-root").first();
    cy.contains("sub-test");
  });
});

context("Album page empty", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/album/@test?fixture-set=empty");
  });

  it("should not display the pictures.", () => {
    cy.get("#pictureBox");
    cy.get("img").should("not.exist");
  });
  it("should display the sub directories.", () => {
    cy.get("#subAlbumBox .MuiBox-root").first();
    cy.contains("sub-test");
  });
});
