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
});
