import D from '../../src/i18n';

context('sonor', () => {
  it('Test monitoring tables', () => {
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
        '**/api/campaign/**/survey-units/state-count',
        'fixture:stateCount.json'
      )
      .as('get-state-count');

    cy.server()
      .route(
        'GET',
        '**/api/campaign/vqs202fgd1x00/survey-units/state-count!(?date=1598918400000)',
        'fixture:campaignStateCountVqs.json'
      )
      .as('get-campaign-state-count');

    cy.server()
      .route(
        'GET',
        '**/api/interviewers/survey-units/state-count**',
        'fixture:stateCountByInterviewer.json'
      )
      .as('get-state-count-by-interviewer');

    cy.server()
      .route(
        'GET',
        '**/api/campaigns/survey-units/state-count**',
        'fixture:stateCountByCampaign.json'
      )
      .as('get-state-count-by-campaign');

    cy.server()
      .route(
        'GET',
        '**/follow/sites/null/api/campaign/vqs202fgd1x00/survey-units/state-count?date=1598918400000',
        'fixture:campaignStateCountVqsotherdate.json'
      )
      .as('get-campaign-state-count-other-date');

    cy.server()
      .route(
        'GET',
        '**/api/campaign/vqs202fgd1x00/survey-units/interviewer/INTW33/state-count**',
        'fixture:stateCountInt33.json'
      )
      .as('get-state-count-int-33');

    cy.server()
      .route(
        'GET',
        '**/api/campaign/**/survey-units/interviewer/!(INTW33)/state-count**',
        'fixture:stateCountIntOther.json'
      )
      .as('get-state-count-int-other');

    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.fetch = null;
      },
    });

    // test
    // Main screen view is initially displayed
    cy.get('#MainScreen');
    // Click on the review cell of first row to go to review
    cy.get('tbody').within(() => {
      cy.get('td').first().click();
    });

    // Testing sort by site
    cy.get('tbody')
      .find('td')
      .first()
      .should('have.text', 'National organizational unit');
    cy.get('th').contains('Site').click();
    cy.get('tbody')
      .find('td')
      .first()
      .should('have.text', 'South region organizational unit');

    // Testing sort by progress
    cy.get('th').contains(D.completionRate).click();
    cy.get('tbody').find('td').eq(2).should('have.text', '1.9%');
    cy.get('th').contains(D.completionRate).click();
    cy.get('tbody').find('td').eq(2).should('have.text', '5.8%');

    // Testing sort by allocated
    cy.get('th').contains(D.allocated).click();
    cy.get('tbody').find('td').eq(4).should('have.text', '88');
    cy.get('th').contains(D.allocated).click();
    cy.get('tbody').find('td').eq(4).should('have.text', '104');

    // Testing sort by not started
    cy.get('th').contains(D.notStarted).click();
    cy.get('tbody').find('td').eq(5).should('have.text', '4');
    cy.get('th').contains(D.notStarted).click();
    cy.get('tbody').find('td').eq(5).should('have.text', '22');

    // Testing sort by ongoing interviewer
    cy.get('th').contains(D.inProgressInterviewer).click();
    cy.get('tbody').find('td').eq(6).should('have.text', '31');
    cy.get('th').contains(D.inProgressInterviewer).click();
    cy.get('tbody').find('td').eq(6).should('have.text', '75');

    // Testing sort by waiting for interviewer validation
    cy.get('th').contains(D.waitingForIntReview).click();
    cy.get('tbody').find('td').eq(7).should('have.text', '0');
    cy.get('th').contains(D.waitingForIntReview).click();
    cy.get('tbody').find('td').eq(7).should('have.text', '5');

    // Testing sort by validated by interviewer
    cy.get('th').contains(D.reviewedByInterviewer).click();
    cy.get('tbody').find('td').eq(8).should('have.text', '1');
    cy.get('th').contains(D.reviewedByInterviewer).click();
    cy.get('tbody').find('td').eq(8).should('have.text', '2');

    // Testing sort by validated and finalized
    cy.get('th').contains(D.reviewedEnded).click();
    cy.get('tbody').find('td').eq(9).should('have.text', '4');
    cy.get('th').contains(D.reviewedEnded).click();
    cy.get('tbody').find('td').eq(9).should('have.text', '7');

    // Testing sort by preparing contact
    cy.get('th').contains(D.preparingContact).click();
    cy.get('tbody').find('td').eq(11).should('have.text', '2');
    cy.get('th').contains(D.preparingContact).click();
    cy.get('tbody').find('td').eq(11).should('have.text', '29');

    // Testing sort by at least one contact
    cy.get('th').contains(D.atLeastOneContact).click();
    cy.get('tbody').find('td').eq(12).should('have.text', '12');
    cy.get('th').contains(D.atLeastOneContact).click();
    cy.get('tbody').find('td').eq(12).should('have.text', '30');

    // Testing sort by appointment taken
    cy.get('th').contains(D.appointmentTaken).click();
    cy.get('tbody').find('td').eq(13).should('have.text', '11');
    cy.get('th').contains(D.appointmentTaken).click();
    cy.get('tbody').find('td').eq(13).should('have.text', '12');

    // Testing sort by interview started
    cy.get('th').contains(D.interviewStarted).click();
    cy.get('tbody').find('td').eq(14).should('have.text', '5');
    cy.get('th').contains(D.interviewStarted).click();
    cy.get('tbody').find('td').eq(14).should('have.text', '8');

    // Testing search field filter by site
    cy.get('.SearchFieldInput').clear().type('sou');
    cy.get('tbody').find('tr').should('have.length', 1);
    cy.get('tbody')
      .find('td')
      .first()
      .should('have.text', 'South region organizational unit');

    cy.get('#datePicker').click().type('2020-08-31');
    cy.get('tbody').find('td').eq(5).should('have.text', '22');

    // Return to main screen
    cy.get('a').contains(D.back).click();
    cy.get('#MainScreen');

    // Go to monitoring table by interviewers for the first survey
    cy.get('tbody').find('td').eq(9).find('a').click({ force: true });

    cy.get('tbody').find('td').eq(2).should('have.text', '2.9%');

    // Testing search field filter by site
    cy.get('.SearchFieldInput').clear().type('leg');
    cy.get('tbody').find('tr').should('have.length', 1);
    cy.get('tbody').find('td').first().should('have.text', 'Legrand Patrice');

    cy.server()
      .route(
        'GET',
        '**/api/campaign/**/interviewers',
        'fixture:getInterviewersSurveyOnSomething.json'
      )
      .as('get-interviewers-SurveyOnSomething');

    cy.get('.SearchFieldInput').clear();

    // Go to monitoring table by survey
    cy.get('#BtnSuivreParent').click();
    cy.get('a').contains(D.progression).first().click({ force: true });
    cy.wait(['@get-state-count-by-campaign']);
    cy.wait(1500);
    cy.get('tbody').find('td').eq(2).should('have.text', '24.2%');

    // Testing search field filter by survey label
    cy.get('.SearchFieldInput').clear().type('someth');
    cy.get('tbody').find('tr').should('have.length', 2);
    cy.get('tbody')
      .find('td')
      .first()
      .should('have.text', 'Survey on something 2020');

    cy.get('.SearchFieldInput').clear();

    // Go to monitoring table by interviewer all surveys
    cy.get('#BtnSuivreParent').click();
    cy.get('button[data-testid="follow-by-interviewer"]').click({ force: true });

    cy.get('[data-testid="Survey_selector"]').select('vqs202fgd1x00');
    cy.wait(3000);

    cy.get('tbody').find('td').eq(2).should('have.text', '24.2%');

    // Testing page change
    cy.get('.paginationNav').contains('2').click();
    cy.get('tbody').find('td').first().should('have.text', 'Thierry Renée');

    // Testing pagination size change
    cy.get('[data-testid="pagination-size-selector"]').select('20');
    cy.get('tbody').find('tr').should('have.length', 11);

    // Testing search field filter by interviewer
    cy.get('.SearchFieldInput').clear().type('dup');
    cy.get('tbody').find('tr').should('have.length', 3);
    cy.get('tbody').find('td').first().should('have.text', 'Dupont Chloé');

    cy.get('.ReturnButton').click();
    cy.get('#MainScreen');
  });
});
