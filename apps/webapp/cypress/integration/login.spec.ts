/// <reference types="Cypress" />

const { routes } = require("@howdypix/utils");

context("LoginBox page", () => {
  beforeEach(() => {
    cy.visit("/?fixture-set=full");
  });

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
    cy.findByTestId("login_form")
      .should("not.contain", "an authorized email")
      .should("not.contain", "error");
  });

  it("should be redirect to the homepage if the magic link is valid.", () => {
    cy.visit(
      routes.magickLinkValidation.value("goodCode") + "?fixture-set=full"
    );

    cy.location().should(loc => {
      expect(loc.pathname).to.eq("/");
    });
  });

  it("should be show an error message if the magic link is incorrect.", () => {
    cy.visit(
      routes.magickLinkValidation.value("badCode") + "?fixture-set=full"
    );
    // @TODO need to display a proper error
    cy.location().should(loc => {
      expect(loc.pathname).to.not.eq("/");
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
