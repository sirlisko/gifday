describe("The Web App", () => {
  it("successfully selected a gif", () => {
    cy.visit("http://localhost:3000");
    cy.get('[role="button"]').first().click();
    cy.get('input[type="text"]').type("pizza");
    cy.get("form").submit();
    cy.get('[class*="modal"] video');
  });

  it.skip("successfully show the gif on hover an img", () => {
    cy.visit("http://localhost:3000");
    cy.get('[class*="StyledDay"]').first().click();
    cy.get('input[type="text"]').type("pizza");
    cy.get("form").submit();
    cy.get('[class*="StyledOk"]').click();
    cy.get('[class*="StyledMonth"] video').should("not.be.visible");
    cy.get('[class*="StyledMonth"] img').should("be.visible");
    cy.get('[class*="StyledDay"]').first().trigger("mouseenter");
    cy.get('[class*="StyledMonth"] video').should("be.visible");
    cy.get('[class*="StyledMonth"] img').should("not.be.visible");
  });
});
