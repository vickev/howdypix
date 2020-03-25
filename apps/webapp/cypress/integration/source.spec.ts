context("Index page", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/?fixture-set=full");
  });

  it("should display the source list.", () => {
    cy.findByText("source1").should("exist");
    cy.findByText("source2").should("exist");
    cy.findByText("source3").should("exist");
  });

  it("Clicking on a source should get us to the album.", () => {
    cy.findByText("source1").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/album/@source1:.");
    });
  });
});
