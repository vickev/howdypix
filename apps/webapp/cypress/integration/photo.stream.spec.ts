context("Photo page - Stream", () => {
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

  it("should have the first picture of the photo stream the same as the picture shown.", () => {
    cy.visit("/photo/@test:test/firstPhoto.jpg?fixture-set=photoStream");

    cy.findAllByTestId("thumbnail-image").should("have.length", 6);

    cy.findAllByTestId("thumbnail-image")
      .first()
      .should(
        "have.css",
        "background-image",
        'url("http://localhost:3000/static-tests/albert.jpg?id1")'
      );
  });

  it("should have the last picture of the photo stream the same as the picture shown.", () => {
    cy.visit("/photo/@test:test/lastPhoto.jpg?fixture-set=photoStream");

    cy.findAllByTestId("thumbnail-image")
      .last()
      .should(
        "have.css",
        "background-image",
        'url("http://localhost:3000/static-tests/albert.jpg?id1")'
      );
  });

  it("should have the middle picture of the photo stream the same as the picture shown.", () => {
    cy.visit("/photo/@test:test/middlePhoto.jpg?fixture-set=photoStream");

    cy.findAllByTestId("thumbnail-image")
      .eq(2)
      .should(
        "have.css",
        "background-image",
        'url("http://localhost:3000/static-tests/albert.jpg?id1")'
      );
  });

  it("should have only three picture in the photo stream.", () => {
    cy.visit("/photo/@test:test/3files.jpg?fixture-set=photoStream");

    cy.findAllByTestId("thumbnail-image").should("have.length", 3);
  });
});
