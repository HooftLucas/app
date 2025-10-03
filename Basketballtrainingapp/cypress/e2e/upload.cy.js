describe('Frontend - Upload Oefening', () => {
  beforeEach(() => {
    cy.visit('/upload');
  });

  it('fills the form and successfully submits (with diagram)', () => {
    // Intercept the POST request and assert payload
    cy.intercept('POST', 'http://localhost:5000/api/oefeningen', (req) => {
      // Allow test to inspect the body and send a fake response
      req.reply({ statusCode: 201, body: { message: 'Oefening toegevoegd', id: 999 } });
    }).as('postOefening');

    // Fill form fields
    cy.get('input[name="titel"]').type('E2E Upload Test');
    cy.get('select').select('U12');
    cy.get('input[name="duur"]').type('12');
    cy.get('input[name="thema"]').type('E2E Thema');
    cy.get('textarea[name="teaching_points"]').type('Punt A\nPunt B');
    cy.get('textarea[name="beschrijving"]').type('Beschrijving voor upload test');

    // Open diagram modal
    cy.contains(/Diagram toevoegen|Diagram bewerken/).click();

    // The Konva canvas should appear; click roughly in the middle to add an element
    cy.get('div[role="dialog"]').should('exist');
    // Find a canvas inside the modal and click coordinates (Konva uses canvas)
    cy.get('div[role="dialog"]').within(() => {
      cy.get('canvas').first().click(100, 80);
      // Change tool and add another element
      cy.contains('Verdediger (X)').click();
      cy.get('canvas').first().click(140, 120);
      // Save the diagram
      cy.contains('Opslaan').click();
    });

    // Submit the form
    cy.contains('Oefening Toevoegen').click();

    cy.wait('@postOefening').its('request.body').then((body) => {
      expect(body).to.have.property('titel', 'E2E Upload Test');
      expect(body).to.have.property('diagram');
      expect(body.diagram).to.be.an('array');
      expect(body.teaching_points).to.deep.equal(['Punt A', 'Punt B']);
    });

    // Success message displayed
    cy.contains('Oefening succesvol toegevoegd').should('be.visible');
  });
});
