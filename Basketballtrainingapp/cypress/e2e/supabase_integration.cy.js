describe('Supabase integration via backend API', () => {
  const api = 'http://localhost:5000/api/oefeningen';
  let createdId = null;

  it('POST -> create oefening', () => {
    cy.request({
      method: 'POST',
      url: api,
      body: {
        titel: 'Cypress integration test',
        doelgroep: 'U12',
        duur: 5,
        categorie: 'test',
        topics: ['Cypress'],
        positions: [],
        teaching_points: ['tp1'],
        beschrijving: 'desc',
        diagram: []
      },
      failOnStatusCode: false
    }).then((resp) => {
      expect([200,201]).to.include(resp.status);
      // backend may return {id} or {oefening}
      if (resp.body && resp.body.oefening) {
        createdId = resp.body.oefening.id || resp.body.oefening[0] && resp.body.oefening[0].id;
      } else if (resp.body && resp.body.id) {
        createdId = resp.body.id;
      }
      expect(createdId).to.be.a('number');
    });
  });

  it('GET -> list bevat de gemaakte oefening', () => {
    cy.request('GET', api).then((resp) => {
      expect(resp.status).to.equal(200);
      const list = resp.body.oefeningen || resp.body;
      expect(list).to.be.an('array');
      const found = list.find((i) => i.id === createdId);
      expect(found, 'created item found in list').to.exist;
    });
  });

  it('PUT -> update oefening', () => {
    const url = `${api}/${createdId}`;
    cy.request({ method: 'PUT', url, body: { titel: 'Cypress integration test - updated' }, failOnStatusCode: false }).then((resp) => {
      expect(resp.status).to.be.oneOf([200,201]);
      const oef = resp.body.oefening || resp.body;
      expect(oef).to.exist;
    });
  });

  it('DELETE -> remove oefening', () => {
    const url = `${api}/${createdId}`;
    cy.request({ method: 'DELETE', url, failOnStatusCode: false }).then((resp) => {
      expect(resp.status).to.be.oneOf([200,204]);
    });
  });
});
