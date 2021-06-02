import D from '../../src/i18n';

context('sonor', () => {
  it('Test mainScreen', () => {
    cy.server()
      .route('GET', '**/api/user', 'fixture:getUser.json')
      .as('get-user');

    cy.server()
      .route('GET', '**/api/campaigns', 'fixture:getCampaigns.json')
      .as('get-campaigns');

    cy.server()
      .route('GET', '/configuration.json', 'fixture:configuration.json')
      .as('get-config');

    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.fetch = null;
      },
    });

    // test
    // Main screen view is initially displayed
    cy.get('#MainScreen');
    cy.wait([
      '@get-campaigns',
      '@get-campaigns',
      '@get-campaigns',
      '@get-campaigns',
    ]);
    cy.wait(2000);

    // Testing sort by Survey
    cy.get('tbody').within(() => {
      cy.get('td')
        .first()
        .should('have.text', 'Everyday life and health survey 2018');
    });

    cy.get('#MainScreen').find('thead').find('tr').eq(1)
      .find('th').first().click();
    cy.wait(2000);


     // Testing sort by Collection start date
    cy.get('th').contains(D.collectionStartDate).click();
    cy.wait(800);
    cy.get('tbody').within(() => {
      cy.get('td')
        .eq(2)
        .contains(/10\/12\/2019|12\/10\/2019/g);
    });
    
    cy.get('th').contains(D.collectionStartDate).click();
    cy.get('tbody').within(() => {
      cy.get('td')
        .eq(2)
        .contains(/10\/12\/2019|12\/10\/2019/g);
    });

    // Testing sort by Collection end date
    cy.get('th').contains(D.collectionEndDate).click();
    cy.wait(800);
    cy.get('tbody').within(() => {
      cy.get('td')
        .eq(3)
        .contains(/01\/01\/2022|1\/1\/2022/g);
    });
    cy.get('th').contains(D.collectionEndDate).click();
    cy.wait(800);
    cy.get('tbody').within(() => {
      cy.get('td')
        .eq(3)
        .contains(/01\/01\/2022|1\/1\/2022/g);
    });

    // Testing sort by treatment end date
    cy.get('th').contains(D.endDate).click();
    cy.wait(500);
    cy.get('tbody').within(() => {
      cy.get('td')
        .eq(4)
        .contains(/07\/01\/2022|1\/7\/2022/g);
    });
    cy.get('th').contains(D.endDate).click();
    cy.wait(500);
    cy.get('tbody').within(() => {
      cy.get('td')
        .eq(4)
        .contains(/07\/01\/2022|1\/7\/2022/g);
    });

    // Testing sort by phase
    cy.get('th').contains(D.phase).click();
    cy.wait(500);
    cy.get('tbody').within(() => {
      cy.get('td').eq(6).should('have.text', D.collectionInProgress);
    });
    cy.get('th').contains(D.phase).click();
    cy.wait(500);
    cy.get('tbody').within(() => {
      cy.get('td').eq(6).should('have.text', D.collectionInProgress);
    });

    // Testing sort by number of su allocated
    cy.get('th').contains(D.allocated).click();
    cy.wait(500);
    cy.get('tbody').within(() => {
      cy.get('td').eq(8).should('have.text', '2');
    });
    cy.get('th').contains(D.allocated).click();
    cy.wait(500);
    cy.get('tbody').within(() => {
      cy.get('td').eq(8).should('have.text', '5');
    });

    // Testing sort by number of su to be processed by interviewer
    cy.get('th').contains(D.toTreatInterviewer).click();
    cy.wait(500);
    cy.get('tbody').within(() => {
      cy.get('td').eq(9).should('have.text', '0');
    });
    cy.get('th').contains(D.toTreatInterviewer).click();
    cy.wait(500);
    cy.get('tbody').within(() => {
      cy.get('td').eq(9).should('have.text', '7');
    });

    // Testing sort by number of su to affect
    cy.get('th').contains(D.toBeAssigned).click();
    cy.wait(500);
    cy.get('tbody').within(() => {
      cy.get('td').eq(10).should('have.text', '0');
    });
    cy.get('th').contains(D.toBeAssigned).click();
    cy.wait(500);
    cy.get('tbody').within(() => {
      cy.get('td').eq(10).should('have.text', '2');
    });

    // Testing sort by number of su to follow up
    cy.get('th').contains(D.toRemind).click();
    cy.wait(500);
    cy.get('tbody').within(() => {
      cy.get('td').eq(11).should('have.text', '0');
    });
    cy.get('th').contains(D.toRemind).click();
    cy.wait(500);
    cy.get('tbody').within(() => {
      cy.get('td').eq(11).should('have.text', '3');
    });

    // Testing sort by number of su to review
    cy.get('th').contains(D.toBeReviewed).click();
    cy.wait(500);
    cy.get('tbody').within(() => {
      cy.get('td').eq(12).should('have.text', '0');
    });
    cy.get('th').contains(D.toBeReviewed).click();
    cy.wait(500);
    cy.get('tbody').within(() => {
      cy.get('td').eq(12).should('have.text', '1');
    });

    // Testing sort by number of su finalized
    cy.get('th').contains(D.terminated).click();
    cy.wait(500);
    cy.get('tbody').within(() => {
      cy.get('td').eq(13).should('have.text', '0');
    });
    cy.get('th').contains(D.terminated).click();
    cy.wait(500);
    cy.get('tbody').within(() => {
      cy.get('td').eq(13).should('have.text', '2');
    });

    // Testing page change
    cy.get('.paginationNav').contains('2').click();
    cy.wait(1500);
    cy.get('tbody').find('tr').should('have.length', 2);

    // Testing pagination change
    cy.get('[data-testid="pagination-size-selector"]').select('20');
    cy.wait(1500);
    cy.get('tbody').find('tr').should('have.length', 12);
    
  });
});
