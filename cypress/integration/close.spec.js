import D from '../../src/i18n';

context('sonor', () => {
  it('Test Close', () => {
    cy.server()
      .route('GET', '**/api/user', 'fixture:getUser.json')
      .as('get-user');

    cy.server()
      .route('GET', '**/api/campaigns', 'fixture:getCampaigns.json')
      .as('get-campaigns');

    cy.server()
      .route('GET', '/configuration.json', 'fixture:configuration.json')
      .as('get-config');

    cy.server()
      .route('GET', '**/api/survey-units/closable', 'fixture:formattedCloseData.json')
      .as('get-closable');

    cy.server()
      .route('PUT', '**/api/survey-unit/1024/close/NPA', 'fixture:status200.json')
      .as('close-1024');
    cy.server()
      .route('PUT', '**/api/survey-unit/4815/close/NPA', 'fixture:status200.json')
      .as('close-4815');

    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.fetch = null;
      },
    });

    // test
    // Main screen view is initially displayed
    cy.get('#MainScreen');
    cy.wait(300);

    // Click on the review cell of first row to go to review
    cy.get('button').contains(D.close2).click();
    cy.wait(300);

    // SUs displayed should be correct
    cy.get('tbody').within(() => {
      cy.get('td').eq(2).should('have.text', '1023');
    });

    // Verify we have 16 SUs
    cy.get('div.card-title')
      .eq(1)
      .should('include.text', `${D.unprocessedSurveyUnitsToClose}16`);

    // Testing sort by survey
    cy.get('th').contains(D.survey).click();
    cy.get('tbody')
      .find('td')
      .eq(1)
      .should('have.text', 'LC 2020');
    cy.get('th').contains(D.survey).click();
    cy.get('tbody')
      .find('td')
      .eq(1)
      .should('have.text', 'VQS');

    // Testing sort by interviewer
    cy.get('th').contains(D.interviewer).click();
    cy.get('tbody').find('td').eq(3).should('have.text', 'Boulanger Jacques');
    cy.get('th').contains(D.interviewer).click();
    cy.get('tbody').find('td').eq(3).should('have.text', 'Fabres Thierry');

    // Testing page change
    cy.get('.paginationNav').contains('2').click();
    cy.get('tbody').find('td').eq(2).should('have.text', '4812');

    // Testing pagination size change
    cy.get('[data-testid="pagination-size-selector"]').select('20');
    cy.get('tbody').find('tr').should('have.length', 16);

    // Testing search field filter by id
    cy.get('.SearchFieldInput').type('1029');
    cy.get('tbody').find('tr').should('have.length', 1);
    cy.get('tbody').find('td').eq(2).should('have.text', '1029');

    // Testing search field filter by interviewer
    cy.get('.SearchFieldInput').clear().type('thie');
    cy.get('tbody').find('tr').should('have.length', 2);
    cy.get('tbody').find('td').eq(3).should('have.text', 'Fabres Thierry');

    // Testing search field filter by label
    cy.get('.SearchFieldInput').clear().type('sim');
    cy.get('tbody').find('tr').should('have.length', 3);
    cy.get('tbody')
      .find('td')
      .eq(1)
      .should('have.text', 'Simpsons');

    // Checking and unchecking a checkbox
    cy.get('[type="checkbox"]').eq(2).check();
    cy.get('[type="checkbox"]').eq(2).should('be.checked');
    cy.get('[type="checkbox"]').eq(2).uncheck();
    cy.get('[type="checkbox"]').eq(2).should('not.be.checked');

    // Check all // uncheck all
    cy.get('[type="checkbox"]').first().check();
    cy.get('[type="checkbox"]').eq(2).should('be.checked');
    cy.get('[type="checkbox"]').eq(3).should('be.checked');
    cy.get('[type="checkbox"]').first().uncheck();
    cy.get('[type="checkbox"]').eq(2).should('not.be.checked');
    cy.get('[type="checkbox"]').eq(3).should('not.be.checked');

    // Testing closing
    cy.get('.SearchFieldInput').clear();
    cy.get('[type="checkbox"]').eq(2).check();
    cy.get('[type="checkbox"]').eq(4).check();
    cy.get('[data-testid="validate-su"]').click();
    cy.wait(300)
    cy.get('[data-testid="closing-cause-select"]').select(D.NPA);

    cy.get('[data-testid="confirm-validate"]').click();
    cy.wait(['@close-1024', '@close-4815', '@get-closable']);
    cy.wait(500);
    cy.get('[type="checkbox"]').eq(2).should('not.be.checked');
    cy.get('[type="checkbox"]').eq(4).should('not.be.checked');

    // Testing return button
    cy.get('a').contains(D.back).click();
    cy.get('#MainScreen');
  });
});
