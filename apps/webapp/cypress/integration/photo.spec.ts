context("Photo page full", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/photo/@test:test/albert.jpg?fixture-set=full");
  });

  it("should display the pictures.", () => {
    cy.findByTestId("picture-detail").should(
      "have.attr",
      "src",
      "http://localhost:3000/static-tests/albert.jpg"
    );
  });

  it("should have a previous button to return to the album.", () => {
    cy.findByText("Previous").click();
    cy.location().should(loc => {
      expect(loc.pathname).to.eq("/album/@test:test");
    });
  });
});
