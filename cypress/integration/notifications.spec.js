import D from '../../src/i18n';

context('sonor', () => {
  it('Test notifications', () => {
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
      .route('GET', '**/api/message-history', 'fixture:getMessageHistory.json')
      .as('get-message-history');

    cy.server()
      .route('POST', '**/api/verify-name', 'fixture:verifyName.json')
      .as('get-suggestions');

    cy.server()
      .route('POST', '**/api/message', 'fixture:status200.json')
      .as('post-message');

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
    cy.get('button').contains(D.notify).click();
    cy.wait(300);

    // Message history is displayed
    cy.get('#messageHistory').find('tr').eq(2).within(() => {
      cy.get('td').eq(1).should('include.text', '@vqs2021x00 (Everyday life and he...)');
      cy.get('td').eq(2).should('have.text', 'test 6');

      // Open modal
      cy.get('td').first().click();
    });
    cy.get('.modal-body').find('div').eq(1).should('include.text', '@vqs2021x00 (Everyday life and he...)');
    cy.get('button').contains('OK').click();

    // Send a message
    cy.get('.rbt-input-main').type('m');
    cy.wait(300);
    cy.get('span').contains('Margie').click();
    cy.get('.rbt-token').first().should('include.text', '@INTW1 (Margie Lucas)');

    cy.get('#message').type('test message');

    cy.get('#sendButton').click();
    cy.wait(['@post-message', '@get-message-history']);

    // Testing return button
    cy.get('a').contains(D.back).click();
    cy.get('#MainScreen');
  });
});
