describe('Backend API - Oefeningen', () => {
  const apiBase = 'http://localhost:5000';

  it('GET /api/oefeningen should return a JSON object with array', () => {
    cy.request({ method: 'GET', url: `${apiBase}/api/oefeningen`, failOnStatusCode: false }).then((resp) => {
      // If the backend isn't running, provide a helpful message
      if (resp.status === 0 || resp.status === 404 || resp.status === 500) {
        // Fail early with instruction
        throw new Error(`Backend lijkt niet bereikbaar (status: ${resp.status}). Start je Flask-server op poort 5000 en probeer opnieuw.`);
      }

      expect(resp.status).to.equal(200);
      expect(resp.body).to.have.property('oefeningen');
      expect(resp.body.oefeningen).to.be.an('array');
    });
  });

  it('POST /api/oefeningen should create a new oefening and GET by id returns it', () => {
    const payload = {
      titel: 'Cypress API test',
      doelgroep: 'U12',
      duur: 10,
      thema: 'Testen',
      beschrijving: 'Automatisch aangemaakte oefening voor testing',
      teaching_points: ['Punt A', 'Punt B']
    };

    cy.request({ method: 'POST', url: `${apiBase}/api/oefeningen`, body: payload, headers: { 'Content-Type': 'application/json' }, failOnStatusCode: false }).then((postResp) => {
      if (postResp.status !== 201) {
        throw new Error(`POST mislukt (status: ${postResp.status}). Controleer backend logs.`);
      }

      expect(postResp.body).to.have.property('id');
      const newId = postResp.body.id;

      cy.request({ method: 'GET', url: `${apiBase}/api/oefeningen/${newId}` }).then((getResp) => {
        expect(getResp.status).to.equal(200);
        expect(getResp.body).to.have.property('titel', payload.titel);
      });
    });
  });
});
