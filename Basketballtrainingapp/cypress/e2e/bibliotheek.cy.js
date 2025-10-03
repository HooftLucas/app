describe('Frontend - Bibliotheek page', () => {
  beforeEach(() => {
    // Stub the backend response so tests are stable
    cy.intercept('GET', 'http://localhost:5000/api/oefeningen', { fixture: 'oefeningen.json' }).as('getOefeningen');
    cy.visit('/');
    cy.wait('@getOefeningen');
  });

  it('shows the library title and list items', () => {
    cy.contains('Oefeningen Bibliotheek').should('be.visible');
    // Table rows should match fixture count
    cy.get('tbody tr').should('have.length', 2);
    cy.contains('Dribbelwedstrijd').should('be.visible');
    cy.contains('Pass en cut').should('be.visible');
  });

  it('filters by title and doelgroep', () => {
    // Search by part of title
    cy.get('input[placeholder="Zoek op titel..."]').type('Dribbel');
    cy.get('tbody tr').should('have.length', 1).and('contain', 'Dribbelwedstrijd');

    // Reset and filter by doelgroep
    cy.get('input[placeholder="Zoek op titel..."]').clear();
    cy.get('select').select('U14');
    cy.get('tbody tr').should('have.length', 1).and('contain', 'Pass en cut');
  });

  it('navigates to oefening detail when clicking a row', () => {
    // Stub the detail endpoint for id=1
    cy.intercept('GET', 'http://localhost:5000/api/oefeningen/1', {
      statusCode: 200,
      body: {
        id: 1,
        titel: 'Dribbelwedstrijd',
        doelgroep: 'U12',
        duur: 15,
        thema: 'Dribbelen',
        beschrijving: 'Oefening gericht op dribbelen onder druk.',
        teaching_points: ['Kijk naar voren', 'Bescherm de bal']
      }
    }).as('getDetail');

    cy.get('tbody tr').first().click();
    cy.wait('@getDetail');

    cy.url().should('include', '/oefening/1');
    cy.contains('Dribbelwedstrijd').should('be.visible');
    cy.contains('Teaching Points').should('be.visible');
  });
});
