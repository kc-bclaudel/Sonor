context('sonor', () => {
  it('Test mainScreen', () => {

    cy.server()
      .route('GET', '**/api/user', 'fixture:getUser.json')
      .as('get-user');

    cy.server()
    .route('GET', '**/api/campaigns', 'fixture:getSurveys.json')
    .as('get-campaigns');

    cy.server()
    .route('GET', '/configuration.json', 'fixture:configuration.json')
    .as('get-config');

    cy.visit('/',{
      onBeforeLoad: win => {
        win.fetch = null;
      },
    });

    // test
    // Main screen view is initially displayed
    cy.get('#MainScreen');

    // Testing sort by Survey
    cy.get('tbody').within(() => {
      cy.get('td').first().should('have.text', 'Everyday life and health survey 2018');
    });
    cy.get('th').contains('Enquête').click();
    cy.get('tbody').within(() => {
      cy.get('td').first().should('have.text', 'Survey on the Simpsons tv show 2020');
    });

    // Testing sort by Collection start date
    cy.get('th').contains('Début collecte').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(2).should('have.text', '26/05/2020');
    });
    cy.get('th').contains('Début collecte').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(2).should('have.text', '15/05/2021');
    });

    // Testing sort by Collection end date
    cy.get('th').contains('Fin collecte').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(3).should('have.text', '07/07/2020');
    });
    cy.get('th').contains('Fin collecte').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(3).should('have.text', '13/01/2022');
    });

    // Testing sort by treatment end date
    cy.get('th').contains('Fin traitement').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(4).should('have.text', '26/05/2021');
    });
    cy.get('th').contains('Fin traitement').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(4).should('have.text', '26/12/2022');
    });

    // Testing sort by phase
    cy.get('th').contains('Phase').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(6).should('have.text', 'Affectation initiale');
    });
    cy.get('th').contains('Phase').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(6).should('have.text', 'Collecte terminée');
    });

    // Testing sort by number of su allocated
    cy.get('th').contains('Confiées').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(8).should('have.text', '2');
    });
    cy.get('th').contains('Confiées').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(8).should('have.text', '4');
    });

    // Testing sort by number of su to be processed by interviewer
    cy.get('th').contains('À traiter enquêteur').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(9).should('have.text', '0');
    });
    cy.get('th').contains('À traiter enquêteur').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(9).should('have.text', '7');
    });


    // Testing sort by number of su to affect
    cy.get('th').contains('À affecter').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(10).should('have.text', '0');
    });
    cy.get('th').contains('À affecter').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(10).should('have.text', '2');
    });

    // Testing sort by number of su to follow up
    cy.get('th').contains('À relancer').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(11).should('have.text', '0');
    });
    cy.get('th').contains('À relancer').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(11).should('have.text', '3');
    });

    // Testing sort by number of su to review
    cy.get('th').contains('À lire').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(12).should('have.text', '0');
    });
    cy.get('th').contains('À lire').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(12).should('have.text', '1');
    });

    // Testing sort by number of su finalized
    cy.get('th').contains('Terminées').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(13).should('have.text', '0');
    });
    cy.get('th').contains('Terminées').click();
    cy.get('tbody').within(() => {
      cy.get('td').eq(13).should('have.text', '2');
    });

    // Testing page change
    cy.get('.paginationNav').contains('2').click();
    cy.get('tbody').find('tr').should('have.length', 1);

    // Testing pagination change
    cy.get('[data-testid="pagination-size-selector"]').select('10');
    cy.get('tbody').find('tr').should('have.length', 6);
  });
});
