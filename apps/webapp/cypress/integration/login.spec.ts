/// <reference types="Cypress" />

const { routes } = require("@howdypix/utils");

context("LoginBox page", () => {
  it("should display an error if the email is not valid.", () => {
    cy.visit("/login?fixture-set=full");
    cy.findByTestId("login_email").type("not_existing_email{enter}");
    cy.findByTestId("login_form").should("contain", "an authorized email");

    cy.findByTestId("login_email")
      .get("input")
      .clear()
      .type("error@vickev.com{enter}");
    cy.findByTestId("login_form").should("contain", "error occurred");
  });

  it("should be successful if there is the right email.", () => {
    cy.visit("/login?fixture-set=full");
    cy.findByTestId("login_email").type("success@vickev.com{enter}");
    cy.get("body").should("contain", "email has been sent to your address");
  });

  it("should be redirect to the homepage if the magic link is valid.", () => {
    cy.visit(
      routes.magickLinkValidation.value({ code: "goodCode" }) +
        "?fixture-set=full"
    );

    cy.location().should(loc => {
      expect(loc.pathname).to.eq("/");
    });
  });

  it("should be show an error message if the magic link is incorrect.", () => {
    cy.visit(
      routes.magickLinkValidation.value({ code: "badCode" }) +
        "?fixture-set=full"
    );

    cy.location().should(loc => {
      expect(loc.pathname).to.eq("/login");
    });
  });

  it("should renew the token if it is expired.", () => {
    cy.login();
    cy.setCookie("token", "wrongToken");

    cy.visit("/?fixture-set=full");

    cy.getCookie("token").should(cookie => {
      expect(cookie && cookie.value).to.not.eq("wrongToken");
    });
  });

  it("should redirect to login if the token and refreshToken are expired.", () => {
    cy.login();
    cy.setCookie("token", "wrongToken");
    cy.setCookie("refreshToken", "wrongToken");

    cy.visit("/?fixture-set=full");

    cy.location().should(loc => {
      expect(loc.pathname).to.eq("/login");
    });
  });
});
