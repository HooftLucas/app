describe('Edit exercise flow', () => {
  beforeEach(() => {
    // Stub list and detail
    cy.intercept('GET', 'http://localhost:5000/api/oefeningen', { fixture: 'oefeningen.json' }).as('getOefeningen');
    cy.visit('/');
    cy.wait('@getOefeningen');
  });

  it('opens detail and navigates to edit, updates title and saves (PUT intercepted)', () => {
    // Stub detail
    cy.intercept('GET', 'http://localhost:5000/api/oefeningen/1', {
      statusCode: 200,
      body: {
        id: 1,
        titel: 'Dribbelwedstrijd',
        doelgroep: 'U12',
        duur: 15,
        categorie: 'offense',
        topics: ['Balhandling'],
        positions: [],
        teaching_points: ['Kijk naar voren'],
        beschrijving: 'Oefening gericht op dribbelen onder druk.',
        diagram: []
      }
    }).as('getDetail');

    // Intercept PUT
    cy.intercept('PUT', 'http://localhost:5000/api/oefeningen/1', (req) => {
      // Assert that title is updated
      expect(req.body).to.have.property('titel', 'Dribbelwedstrijd - aangepast');
      req.reply({ statusCode: 200, body: { message: 'Oefening bijgewerkt', oefening: req.body } });
    }).as('putOefening');

    // Navigate to detail
    cy.get('tbody tr').first().click();
    cy.wait('@getDetail');
    cy.contains('Dribbelwedstrijd').should('be.visible');

    // Click edit
    cy.contains('Edit').click();

    // Edit form should be visible and title prefilled
    cy.get('input[name="titel"]').should('have.value', 'Dribbelwedstrijd');
    cy.get('input[name="titel"]').clear().type('Dribbelwedstrijd - aangepast');

    // Submit
    cy.contains('Opslaan oefening').click();

    cy.wait('@putOefening');
  });
});
