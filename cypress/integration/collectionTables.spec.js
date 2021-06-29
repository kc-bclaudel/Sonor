import D from '../../src/i18n';

context('sonor', () => {
  it('Test collection tables', () => {
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
        '**/api/campaign/**/survey-units/contact-outcomes',
        'fixture:contactOutcomes.json'
      )
      .as('get-contact-outcomes');

      cy.server()
      .route(
        'GET',
        '**/api/interviewers',
        'fixture:interviewers.json'
      )
      .as('get-interviewers');

      cy.server()
      .route(
        'GET',
        '**/api/interviewer/INTW5/campaigns',
        'fixture:interviewerCampaigns.json'
      )
      .as('get-campaigns-of-interviewer');

      

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
        '**/api/campaign/vqs202fgd1x00/survey-units/contact-outcomes!(?date=1598918400000)',
        'fixture:campaignContactOutcomesVqs.json'
      )
      .as('get-campaign-contact-outcomes');

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
        '**/api/interviewers/survey-units/contact-outcomes**',
        'fixture:contactOutcomesByInterviewer.json'
      )
      .as('get-contact-outcomes-by-interviewer');

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
        '**/api/campaigns/survey-units/contact-outcomes**',
        'fixture:contactOutcomesByCampaign.json'
      )
      .as('get-contact-outcomes-by-campaign');

    cy.server()
      .route(
        'GET',
        '**/collection/sites/null/api/campaign/vqs202fgd1x00/survey-units/state-count?date=1598918400000',
        'fixture:campaignStateCountVqsotherdate.json'
      )
      .as('get-campaign-state-count-other-date');

      cy.server()
      .route(
        'GET',
        '**/collection/sites/null/api/campaign/vqs202fgd1x00/survey-units/contact-outcomes?date=1598918400000',
        'fixture:campaignContactOutcomesVqsotherdate.json'
      )
      .as('get-campaign-contact-outcomes-other-date');

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
        '**/api/campaign/vqs202fgd1x00/survey-units/interviewer/INTW33/contact-outcomes**',
        'fixture:contactOutcomesInt33.json'
      )
      .as('get-contact-outcomes-int-33');

      cy.server()
      .route(
        'GET',
        '**/api/campaign/vqs202fgd1x00/survey-units/not-attributed/state-count**',
        'fixture:stateCountNotAttributed.json'
      )
      .as('get-state-count-not-attributed');

      cy.server()
      .route(
        'GET',
        '**/api/campaign/vqs202fgd1x00/survey-units/not-attributed/contact-outcomes**',
        'fixture:contactOutcomesNotAttributed.json'
      )
      .as('get-contact-outcomes-not-attributed');

    cy.server()
      .route(
        'GET',
        '**/api/campaign/**/survey-units/interviewer/!(INTW33)/state-count**',
        'fixture:stateCountIntOther.json'
      )
      .as('get-state-count-int-other');

    cy.server()
      .route(
        'GET',
        '**/api/campaign/**/survey-units/interviewer/!(INTW33)/contact-outcomes**',
        'fixture:contactOutcomesIntOther.json'
      )
      .as('get-contact-outcomes-int-other');

    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.fetch = null;
      },
    });

    // test
    // Main screen view is initially displayed
    cy.get('#MainScreen');
    cy.wait(1500);
    // Click on the review cell of first row to go to collection table by site
    cy.get('button').contains(D.follow).click();
    cy.wait(8000);
    cy.get('button').contains(D.collectionBySite).click({ force: true });
    cy.wait(8000);
    cy.get('[data-testid="Survey_selector"]').select('vqs202fgd1x00');
    cy.wait(13500);

    // Testing sort by site
    cy.get('tbody')
      .find('td')
      .first()
      .should('have.text', 'National organizational unit');
    cy.get('th').contains('Site').click();
    cy.wait(2000);
    cy.get('tbody')
      .find('td')
      .first()
      .should('have.text', 'South region organizational unit');

    // Testing sort by collectionRate
    cy.get('th').contains(D.collectionRate).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(2).should('have.text', '32.4%');
    cy.get('th').contains(D.collectionRate).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(2).should('have.text', '38.4%');

    // Testing sort by wasteRate
    cy.get('th').contains(D.wasteRate).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(3).should('have.text', '19.8%');
    cy.get('th').contains(D.wasteRate).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(3).should('have.text', '24.4%');

    // Testing sort by not outOfScopeRate
    cy.get('th').contains(D.outOfScopeRate).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(4).should('have.text', '19.6%');
    cy.get('th').contains(D.outOfScopeRate).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(4).should('have.text', '19.8%');

    // Testing sort by surveysAccepted
    cy.get('th').contains(D.surveysAccepted).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(6).should('have.text', '33');
    cy.get('th').contains(D.surveysAccepted).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(6).should('have.text', '33');

    // Testing sort by refusal
    cy.get('th').contains(D.refusal).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(7).should('have.text', '2');
    cy.get('th').contains(D.refusal).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(7).should('have.text', '3');

    // Testing sort by unreachable
    cy.get('th').contains(D.unreachable).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(8).should('have.text', '4');
    cy.get('th').contains(D.unreachable).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(8).should('have.text', '5');

    // Testing sort by otherWastes
    cy.get('th').contains(D.otherWastes).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(9).should('have.text', '11');
    cy.get('th').contains(D.otherWastes).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(9).should('have.text', '12');

    // Testing sort by at totalProcessed
    cy.get('th').contains(D.totalProcessed).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(11).should('have.text', '2');
    cy.get('th').contains(D.totalProcessed).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(11).should('have.text', '6');

    // Testing sort by absInterviewer
    cy.get('th').contains(D.absInterviewer).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(13).should('have.text', '2');
    cy.get('th').contains(D.absInterviewer).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(13).should('have.text', '3');

    // Testing sort by otherReason
    cy.get('th').contains(D.otherReason).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(14).should('have.text', '2');
    cy.get('th').contains(D.otherReason).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(14).should('have.text', '7');

    // Testing sort by totalClosed
    cy.get('th').contains(D.totalClosed).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(15).should('have.text', '5');
    cy.get('th').contains(D.totalClosed).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(15).should('have.text', '9');

    // Testing sort by allocated
    cy.get('th').contains(D.allocated).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(17).should('have.text', '88');
    cy.get('th').contains(D.allocated).click();
    cy.wait(500);
    cy.get('tbody').find('td').eq(17).should('have.text', '104');
        
    // Testing search field filter by site
    cy.get('.SearchFieldInput').clear().type('sou');
    cy.wait(1500);
    cy.get('tbody').find('tr').should('have.length', 1);
    cy.get('tbody')
      .find('td')
      .first()
      .should('have.text', 'South region organizational unit');

    cy.get('#datePicker').click().type('2020-08-31');
    cy.wait(1000);
    cy.get('tbody').find('td').eq(7).should('have.text', '2');

    // Return to main screen
    cy.get('a').contains(D.back).click();
    cy.wait(1000)
    cy.get('#MainScreen');

    // Go to monitoring table by interviewers for the first survey
    cy.get('button').contains(D.follow).click();

    cy.get('button').contains(D.collectionByInterviewer).click({ force: true });
    cy.wait(13000)
    cy.get('[data-testid="Survey_selector"]').select('vqs202fgd1x00');
    cy.wait(13000)
    cy.get('tbody').find('td').eq(2).should('have.text', '32.4%');


    //Testing search field filter by interviewer
    cy.get('.SearchFieldInput').clear();
    cy.wait(1500)
    cy.get('.SearchFieldInput').type('leg');
    cy.wait(1500)
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

    // Go to collection table by survey
    cy.get('button').contains(D.follow).click();
    cy.wait(1500)
    cy.get('[data-testid="collection-by-survey"]').click({ force: true });
    
    cy.wait(['@get-state-count-by-campaign', '@get-contact-outcomes-by-campaign']);
    cy.wait(4000);
    cy.get('tbody').find('td').eq(2).should('have.text', '35.5%');


    // Testing search field filter by survey label
    cy.get('.SearchFieldInput').clear().type('someth');
    cy.get('tbody').find('tr').should('have.length', 2);
    cy.get('tbody')
      .find('td')
      .first()
      .should('have.text', 'Survey on something 2020');

    cy.get('.SearchFieldInput').clear();

    // Go to monitoring table by survey one interviewer
    cy.get('button').contains(D.follow).click();
    cy.get('[data-testid="collection-by-survey-one-interviewer"]').click({ force: true });
    cy.get('[data-testid="Interviewer_selector"]').select('INTW5');

    cy.wait(4000);

    cy.get('tbody').find('td').eq(2).should('have.text', '35.5%');

    cy.get('tbody').find('tr').should('have.length', 3);

    cy.get('.ReturnButton').click(); 
    cy.get('#MainScreen');
  });
});
