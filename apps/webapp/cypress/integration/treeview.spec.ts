context("TreeView", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/?fixture-set=treeView");
  });

  it("should display the entire tree.", () => {
    cy.findByTestId(`treeitem toggle treesource1`).click();
    cy.findByTestId(`treeitem toggle TreeAlbum1`).click();
    cy.findByTestId(`treeitem toggle TreeAlbum3`).click();

    [1, 2, 3].forEach(item => {
      cy.findByTestId(`treeitem treesource${item}`).contains(
        `treesource${item}`
      );
      cy.findByTestId(`treeitem count treesource${item}`).contains(`${item}`);
    });

    [1, 2, 3, 4, 5, 6].forEach(item => {
      cy.findByTestId(`treeitem TreeAlbum${item}`).contains(`Album${item}`);
      cy.findByTestId(`treeitem count TreeAlbum${item}`).contains(`${item}`);
    });
  });

  it("should collapse tree.", () => {
    cy.findByTestId(`treeitem toggle treesource1`).click();
    cy.findByTestId(`treeitem toggle TreeAlbum1`).click();
    cy.findByTestId(`treeitem toggle TreeAlbum3`).click();
    cy.findByTestId(`treeitem toggle TreeAlbum1`).click();

    [3, 4, 5, 6].forEach(item => {
      cy.findByTestId(`treeitem TreeAlbum${item}`).should(`not.visible`);
    });

    [1, 2].forEach(item => {
      cy.findByTestId(`treeitem TreeAlbum${item}`).should(`visible`);
    });

    cy.findByTestId(`treeitem toggle TreeAlbum1`).click();

    [1, 2, 3, 4, 5, 6].forEach(item => {
      cy.findByTestId(`treeitem TreeAlbum${item}`).should(`visible`);
    });
  });

  it("should go to the proper link.", () => {
    cy.findByTestId(`treeitem toggle treesource1`).click();
    cy.findByTestId(`treeitem toggle TreeAlbum1`).click();

    cy.findByTestId(`treeitem TreeAlbum3`).click();
    cy.url().should("include", "@treesource1:TreeAlbum3");
    cy.findByTestId(`treeitem TreeAlbum3 selected`).should("exist");

    cy.findByTestId(`treeitem TreeAlbum1`).click();
    cy.url().should("include", "@treesource1:TreeAlbum1");
    cy.findByTestId(`treeitem TreeAlbum3 selected`).should("not.exist");
    cy.findByTestId(`treeitem TreeAlbum1 selected`).should("exist");

    cy.findByTestId(`treeitem treesource1`).click();
    cy.url().should("include", "@treesource1:.");
    cy.findByTestId(`treeitem TreeAlbum1 selected`).should("not.exist");
    cy.findByTestId(`treeitem treesource1 selected`).should("exist");
  });
});
