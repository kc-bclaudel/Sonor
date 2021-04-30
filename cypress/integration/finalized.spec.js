import D from "../../src/i18n";

context("sonor", () => {
  Object.defineProperty(navigator, 'language', { value: 'en-EN' })
  it("Test finalized", () => {
    cy.server()
      .route("GET", "**/api/user", "fixture:getUser.json")
      .as("get-user");

    cy.server()
      .route("GET", "**/api/campaigns", "fixture:getCampaigns.json")
      .as("get-campaigns");

    cy.server()
      .route("GET", "/configuration.json", "fixture:configuration.json")
      .as("get-config");

    cy.server()
      .route(
        "GET",
        "**/api/campaign/vqs202fgd1x00/interviewers",
        "fixture:getInterviewersVqs.json"
      )
      .as("get-interviewers-vqs");

    cy.server()
      .route(
        "GET",
        "**/api/campaign/simpsosfqns2020x00/interviewers",
        "fixture:getInterviewersSurveyOnSomething.json"
      )
      .as("get-interviewers-SurveyOnSomething");

    cy.server()
      .route(
        "GET",
        "**/api/campaign/vqs202fgd1x00/survey-units",
        "fixture:getSurveyUnitsVqs.json"
      )
      .as("get-interviewers-vqs");

    cy.server()
      .route(
        "GET",
        "**/api/campaign/simpsosfqns2020x00/survey-units",
        "fixture:getSurveyUnitsSurveyOnSomething.json"
      )
      .as("get-interviewers-SurveyOnSomething");

    cy.server()
      .route(
        "GET",
        "**/api/campaign/**/survey-units/state-count",
        "fixture:stateCount.json"
      )
      .as("get-state-count");

    cy.server()
      .route(
        "GET",
        "**/api/campaign/vqs202fgd1x00/survey-units?state=FIN",
        "fixture:getSurveyUnitsVqs.json"
      )
      .as("get-finalized-vqs");

    cy.server()
      .route(
        "GET",
        "**/api/campaign/simpsosfqns2020x00/survey-units?state=FIN",
        "fixture:getSurveyUnitsSurveyOnSomething.json"
      )
      .as("get-finalized-survOnSmth");

    cy.server()
      .route(
        "GET",
        "**/api/campaign/**/survey-units?state=CLO",
        "fixture:emptyList.json"
      )
      .as("get-finalized-survOnSmth");

    cy.server()
      .route("GET", "**/api/survey-unit/1024/states", "fixture:states1023.json")
      .as("get-states-1023");

    cy.server()
      .route("GET", "**/api/survey-unit/4818/states", "fixture:states4818.json")
      .as("get-states-4811");

    cy.visit("/", {
      onBeforeLoad: (win) => {
        win.fetch = null;
      },
    });

    // test
    // Main screen view is initially displayed
    cy.get("#MainScreen");
    // Click on the allocated cell of first row to go to list su
    cy.get("tbody").within(() => {
      cy.get("td").eq(13).find("a").click();
    });

    // Survey title should be correct
    cy.get(".SurveyTitle").should(
      "have.text",
      "Everyday life and health survey 2018"
    );

    // SUs displayed should be correct
    cy.get("tbody").within(() => {
      cy.get("td").eq(1).should("have.text", "1032");
    });

    // Select another survey
    cy.get('[data-testid="Survey_selector"]').select(
      "Survey on something 2020"
    );
    cy.wait(300);

    //Survey title should have changed
    cy.get(".SurveyTitle").should("have.text", "Survey on something 2020");

    // SUs displayed should have changed
    cy.get("tbody").within(() => {
      cy.get("td").eq(1).should("have.text", "1023");
    });

    // Testing sort by id
    cy.get("th").contains(D.identifier).click();
    cy.get("tbody").find("td").eq(1).should("have.text", "1023");
    cy.get("th").contains(D.identifier).click();
    cy.get("tbody").find("td").eq(1).should("have.text", "4818");

    // Testing sort by interviewerf
    cy.get("th").contains(D.interviewer).click();
    cy.get("tbody").find("td").eq(2).should("have.text", "Boulanger Jacques");
    cy.get("th").contains(D.interviewer).click();
    cy.get("tbody").find("td").eq(2).should("have.text", "Fabres Thierry");

    
    // Testing state history display
    cy.get("th").contains(D.identifier).click();
    cy.get(".HistoryDisplayIcon").eq(1).click();
    cy.wait(150);
    cy.get("tbody").eq(1).find("td").eq(2).should("have.text", D.ANV);
    
    // Testing pagination
    cy.get(".paginationNav").contains("3").click();
    cy.get("tbody").find("td").eq(1).should("have.text", "4815");

    // Display history of another state
    cy.get(".HistoryDisplayIcon").last().click();
    cy.wait(150);
    cy.get("tbody").eq(1).find("td").eq(2).should("have.text", D.TBR);

    // Close state history
    cy.get('[data-testid="close-history"]').click();
    cy.get("tbody").should("have.length", 1);

    // Testing pagination size change
    cy.get('[data-testid="pagination-size-selector"]').select("10");
    cy.get("tbody").find("tr").should("have.length", 10);

    // Testing search field filter by id
    cy.get(".SearchFieldInput").type("1029");
    cy.get("tbody").find("tr").should("have.length", 1);
    cy.get("tbody").find("td").eq(1).should("have.text", "1029");

    // Testing search field filter by interviewer
    cy.get(".SearchFieldInput").clear().type("thi");
    cy.get("tbody").find("tr").should("have.length", 2);
    cy.get("tbody").find("td").eq(2).should("have.text", "Fabres Thierry");

    // Testing return button
    cy.get("a").contains(D.back).click();
    cy.get("#MainScreen");
  });
});
