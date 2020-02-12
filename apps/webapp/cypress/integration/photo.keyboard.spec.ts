context("Photo page - Keyboard", () => {
  before(() => {
    Cypress.on("uncaught:exception", () => {
      // returning false here prevents Cypress from
      // failing the test
      return false;
    });
  });

  beforeEach(() => {
    cy.login();
  });

  it("should have the navigation working for PREVIOUS.", () => {
    cy.visit("/photo/@test:test/3files.jpg?fixture-set=photoStream");
    cy.wait(200);
    cy.get("body").type("{leftarrow}");
    cy.url().should("include", "test/previous?");
  });

  it("should not change the URL if pressing PREVIOUS and it's the first image.", () => {
    cy.visit("/photo/@test:test/firstPhoto.jpg?fixture-set=photoStream");
    cy.wait(200);
    cy.get("body").type("{leftarrow}");
    cy.url().should("include", "test/firstPhoto");
  });

  it("should have the navigation working for NEXT.", () => {
    cy.visit("/photo/@test:test/3files.jpg?fixture-set=photoStream");
    cy.wait(200);
    cy.get("body").type("{rightarrow}");
    cy.url().should("include", "test/next?");
  });

  it("should not change the URL if pressing NEXT and it's the last image.", () => {
    cy.visit("/photo/@test:test/lastPhoto.jpg?fixture-set=photoStream");
    cy.wait(200);
    cy.get("body").type("{rightarrow}");
    cy.url().should("include", "test/lastPhoto");
  });

  it("should go back to the previous page when pressing ESC.", () => {
    cy.visit("/photo/@test:test/lastPhoto.jpg?fixture-set=photoStream");
    cy.wait(200);
    cy.get("body").type("{esc}");
    cy.url().should("include", "test:test?order");
  });
});
