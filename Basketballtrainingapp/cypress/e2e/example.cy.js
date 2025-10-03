describe('Sanity check', () => {
  it('visits the base URL', () => {
    cy.visit('/');
    cy.document().its('readyState').should('equal', 'complete');
  });
});