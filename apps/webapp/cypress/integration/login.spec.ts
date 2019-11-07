/// <reference types="Cypress" />

context("LoginBox page", () => {
  beforeEach(() => {
    cy.visit("/login?fixture-set=full");
  });

  it("should display an error if the email is not valid.", () => {
    cy.findByTestId("login_email").type("not_existing_email{enter}");
    cy.findByTestId("login_form").should("contain", "an authorized email");

    cy.findByTestId("login_email")
      .get("input")
      .clear()
      .type("error@vickev.com{enter}");
    cy.findByTestId("login_form").should("contain", "error occurred");
    cy;
  });

  it("should be successful if there is the right email.", () => {
    cy.findByTestId("login_email").type("success@vickev.com{enter}");
    cy.findByTestId("login_form")
      .should("not.contain", "an authorized email")
      .should("not.contain", "error");
  });
});
