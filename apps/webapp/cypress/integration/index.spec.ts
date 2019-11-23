context("Index page", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/?fixture-set=full");
  });

  it("should display the sub directories.", () => {
    cy.get(".MuiButtonBase-root > .MuiButton-label");
    cy.contains("main");
  });
});
