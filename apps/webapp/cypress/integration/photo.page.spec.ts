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

  it("should display all the informations.", () => {
    cy.findByText(/f\/4545/).should("exist");
    cy.findByText(/1\/123/).should("exist");
    cy.findByText(/January 1, 2020 at 1:00 AM/).should("exist");
    cy.findByText(/123234/).should("exist");
  });

  it("should have a previous button to return to the album.", () => {
    cy.findByText("Previous").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/album/@test:test");
    });
  });
});
