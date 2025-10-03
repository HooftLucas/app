describe('CourtDiagram interactions', () => {
  it('opens diagram, switches court type, adds elements and saves', () => {
    cy.visit('/upload');

    // Open diagram
    cy.contains(/Diagram toevoegen|Diagram bewerken/).click();

    cy.get('div[role="dialog"]').should('exist');

    // Switch court type
    cy.contains(/Wissel naar/).click();

    // Click on canvas to add elements using default tool
    cy.get('div[role="dialog"]').within(() => {
      cy.get('canvas').first().click(120, 90);
      cy.contains('Pass').click();
      cy.get('canvas').first().click(200, 140);
      cy.contains('Opslaan').click();
    });

    // Intercept the subsequent POST and verify diagram exists when submitting
    cy.intercept('POST', 'http://localhost:5000/api/oefeningen', (req) => {
      req.reply({ statusCode: 201, body: { message: 'Oefening toegevoegd', id: 123 } });
    }).as('postOefening');

    // Fill minimal required fields and submit
    cy.get('input[name="titel"]').type('Diagram save test');
    cy.get('input[name="duur"]').type('8');
    cy.get('input[name="thema"]').type('Diagram test');
    cy.get('textarea[name="teaching_points"]').type('Point1');
    cy.get('textarea[name="beschrijving"]').type('desc');

    cy.contains('Oefening Toevoegen').click();

    cy.wait('@postOefening').its('request.body').then((body) => {
      expect(body.diagram).to.be.an('array');
      expect(body.diagram.length).to.be.greaterThan(0);
    });
  });
});
