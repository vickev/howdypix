context("TreeView", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/?fixture-set=treeView");
  });

  it("should display the entire tree.", () => {
    cy.findByTestId(`treeitem toggle source1`).click();
    cy.findByTestId(`treeitem toggle Album1`).click();
    cy.findByTestId(`treeitem toggle Album3`).click();

    [1, 2, 3].forEach(item => {
      cy.findByTestId(`treeitem source${item}`).contains(`source${item}`);
      cy.findByTestId(`treeitem count source${item}`).contains(`${item}`);
    });

    [1, 2, 3, 4, 5, 6].forEach(item => {
      cy.findByTestId(`treeitem Album${item}`).contains(`Album${item}`);
      cy.findByTestId(`treeitem count Album${item}`).contains(`${item}`);
    });
  });

  it("should collapse tree.", () => {
    cy.findByTestId(`treeitem toggle source1`).click();
    cy.findByTestId(`treeitem toggle Album1`).click();
    cy.findByTestId(`treeitem toggle Album3`).click();
    cy.findByTestId(`treeitem toggle Album1`).click();

    [3, 4, 5, 6].forEach(item => {
      cy.findByTestId(`treeitem Album${item}`).should(`not.visible`);
    });

    [1, 2].forEach(item => {
      cy.findByTestId(`treeitem Album${item}`).should(`visible`);
    });

    cy.findByTestId(`treeitem toggle Album1`).click();

    [1, 2, 3, 4, 5, 6].forEach(item => {
      cy.findByTestId(`treeitem Album${item}`).should(`visible`);
    });
  });

  it("should go to the proper link.", () => {
    cy.findByTestId(`treeitem toggle source1`).click();
    cy.findByTestId(`treeitem toggle Album1`).click();

    cy.findByTestId(`treeitem Album3`).click();
    cy.url().should("include", "@source1:Album3");
    cy.findByTestId(`treeitem Album3 selected`).should("exist");

    cy.findByTestId(`treeitem Album1`).click();
    cy.url().should("include", "@source1:Album1");
    cy.findByTestId(`treeitem Album3 selected`).should("not.exist");
    cy.findByTestId(`treeitem Album1 selected`).should("exist");

    cy.findByTestId(`treeitem source1`).click();
    cy.url().should("include", "@source1:.");
    cy.findByTestId(`treeitem Album1 selected`).should("not.exist");
    cy.findByTestId(`treeitem source1 selected`).should("exist");
  });
});
