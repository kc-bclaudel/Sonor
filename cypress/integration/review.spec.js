import D from '../../src/i18n';

context('sonor', () => {
  it('Test review', () => {
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
      .route(
        'GET',
        '**/api/campaign/vqs202fgd1x00/interviewers',
        'fixture:getInterviewersVqs.json'
      )
      .as('get-interviewers-vqs');

    cy.server()
      .route(
        'GET',
        '**/api/campaign/simpsosfqns2020x00/interviewers',
        'fixture:getInterviewersSurveyOnSomething.json'
      )
      .as('get-interviewers-SurveyOnSomething');

    cy.server()
      .route(
        'GET',
        '**/api/campaign/vqs202fgd1x00/survey-units',
        'fixture:getSurveyUnitsVqs.json'
      )
      .as('get-interviewers-vqs');

    cy.server()
      .route(
        'GET',
        '**/api/campaign/simpsosfqns2020x00/survey-units',
        'fixture:getSurveyUnitsSurveyOnSomething.json'
      )
      .as('get-interviewers-SurveyOnSomething');

    cy.server()
      .route(
        'GET',
        '**/api/campaign/**/survey-units/state-count',
        'fixture:stateCount.json'
      )
      .as('get-state-count');

    cy.server()
      .route(
        'GET',
        '**/api/campaign/vqs202fgd1x00/survey-units?state=TBR',
        'fixture:getSurveyUnitsVqs.json'
      )
      .as('get-tbr-vqs');

    cy.server()
      .route(
        'GET',
        '**/api/campaign/simpsosfqns2020x00/survey-units?state=TBR',
        'fixture:getSurveyUnitsSurveyOnSomething.json'
      )
      .as('get-tbr-survOnSmth');

    cy.server()
      .route(
        'GET',
        '**/api/campaign/!(vqs202fgd1x00|simpsosfqns2020x00)/survey-units?state=TBR',
        'fixture:emptyArray.json'
      )
      .as('get-tbr-other');

    cy.server()
      .route('GET', '**/api/survey-unit/1023/states', 'fixture:states1023.json')
      .as('get-states-1023');

    cy.server()
      .route('GET', '**/api/survey-unit/4818/states', 'fixture:states4818.json')
      .as('get-states-4811');

    cy.server()
      .route('PUT', '**/api/survey-unit/**/state/FIN', 'fixture:status200.json')
      .as('validate');

    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.fetch = null;
      },
    });

    // test
    // Main screen view is initially displayed
    cy.get('#MainScreen');
    // Click on the close button in the header
    cy.get('tbody').within(() => {
      cy.get('td').eq(12).find('a').click();
    });

    // Survey title should be correct
    cy.get('.SurveyTitle').should(
      'have.text',
      'Everyday life and health survey 2018'
    );

    // SUs displayed should be correct
    cy.get('tbody').within(() => {
      cy.get('td').eq(2).should('have.text', '4819');
    });

    // Select another survey
    cy.get('[data-testid="Survey_selector"]').select(
      'Survey on something 2020'
    );
    cy.wait(300);

    // Survey title should have changed
    cy.get('.SurveyTitle').should('have.text', 'Survey on something 2020');

    // SUs displayed should have changed
    cy.get('tbody').within(() => {
      cy.get('td').eq(2).should('have.text', '3828');
    });

    // Go to review all surveys
    cy.get('button').contains(D.read).click();
    cy.get('a[data-testid="review-link"]').click();
    cy.wait(1300);

    // Verify we now have 16 SUs
    cy.get('div.card-title')
      .eq(1)
      .should('have.text', `${D.surveyUnitsToReview}26`);

    // Testing sort by id
    cy.get('th').contains(D.survey).click();
    cy.get('tbody')
      .find('td')
      .eq(1)
      .should('have.text', 'Everyday life and health survey 2018');
    cy.get('th').contains(D.survey).click();
    cy.get('tbody')
      .find('td')
      .eq(1)
      .should('have.text', 'Survey on something 2020');

    // Testing sort by interviewer
    cy.get('th').contains(D.interviewer).click();
    cy.get('tbody').find('td').eq(3).should('have.text', 'Boulanger Jacques');
    cy.get('th').contains(D.interviewer).click();
    cy.get('tbody').find('td').eq(3).should('have.text', 'Fabres Thierry');

    // Testing page change
    cy.get('.paginationNav').contains('3').click();
    cy.get('tbody').find('td').eq(2).should('have.text', '4817');

    // Testing pagination size change
    cy.get('[data-testid="pagination-size-selector"]').select('20');
    cy.get('tbody').find('tr').should('have.length', 20);

    // Testing search field filter by id
    cy.get('.SearchFieldInput').type('1029');
    cy.get('tbody').find('tr').should('have.length', 1);
    cy.get('tbody').find('td').eq(2).should('have.text', '1029');

    // Testing search field filter by interviewer
    cy.get('.SearchFieldInput').clear().type('thie');
    cy.get('tbody').find('tr').should('have.length', 2);
    cy.get('tbody').find('td').eq(3).should('have.text', 'Fabres Thierry');

    // Testing search field filter by label
    cy.get('.SearchFieldInput').clear().type('some');
    cy.get('tbody').find('tr').should('have.length', 20);
    cy.get('tbody')
      .find('td')
      .eq(1)
      .should('have.text', 'Survey on something 2020');

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

    // Testing validation
    cy.get('[type="checkbox"]').eq(2).check();
    cy.get('[type="checkbox"]').eq(4).check();
    cy.get('button').contains(D.validate).click();
    cy.get('[data-testid="confirm-validate"]').click();
    cy.wait(['@get-tbr-vqs', '@get-tbr-vqs', '@get-tbr-vqs']);
    cy.wait(500);
    cy.get('[type="checkbox"]').eq(2).should('not.be.checked');
    cy.get('[type="checkbox"]').eq(4).should('not.be.checked');

    // Testing return button
    cy.get('a').contains(D.back).click();
    cy.get('#MainScreen');
  });
});
