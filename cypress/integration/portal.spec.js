import D from "../../src/i18n";

context("sonor", () => {
  it("Test portal", () => {
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
        "**/api/campaign/**/survey-units/state-count",
        "fixture:stateCount.json"
      )
      .as("get-state-count");

    cy.visit("/", {
      onBeforeLoad: (win) => {
        win.fetch = null;
      },
    });

    // test
    // Main screen view is initially displayed
    cy.get("#MainScreen");
    // Click on the phase cell of first row to go to portal
    cy.get("tr").contains(D.collectionInProgress).first().click();

    // Survey title should be correct
    cy.get(".SurveyTitle").should(
      "have.text",
      "Everyday life and health survey 2018"
    );
    // Phase in timeline should be correct
    cy.get(".CurrentPhase").should("have.text", D.collectionInProgress);
    // Interviewers should be correct
    cy.wait(1000);
    cy.get("td").contains("Corrine");

    // Select another survey
    cy.get('[data-testid="Survey_selector"]').select(
      "Survey on something 2020"
    );

    //Survey title should have changed
    cy.get(".SurveyTitle").should("have.text", "Survey on something 2020");

    // Phase should have changed
    cy.get(".CurrentPhase").should("have.text", D.collectionInProgress);
    cy.wait(1000);

    // Interviewers should have changed
    cy.get("tbody")
      .eq(1)
      .within(() => {
        cy.get("td").first().should("have.text", "Boulanger Emilie");
      });

    // Testing page change
    cy.get(".paginationNav").contains("2").click();
    cy.get("tbody")
      .eq(1)
      .find("td")
      .first()
      .should("have.text", "Thierry Renée");

    // Testing pagination size change
    cy.get('[data-testid="pagination-size-selector"]').select("20");
    cy.get("tbody").eq(1).find("tr").should("have.length", 15);
    cy.get("tbody")
      .eq(1)
      .find("td")
      .first()
      .should("have.text", "Boulanger Emilie");

    // Testing sort by interviewer name
    cy.get("th").contains(D.interviewer).click();
    cy.get("tbody")
      .eq(1)
      .find("td")
      .first()
      .should("have.text", "Thierry Renée");
    cy.get("th").contains(D.interviewer).click();
    cy.get("tbody")
      .eq(1)
      .find("td")
      .first()
      .should("have.text", "Boulanger Emilie");

    // Testing sort by idep
    cy.get("th").contains(D.idep).click();
    cy.get("tbody").eq(1).find("td").eq(1).should("have.text", "INTW10");
    cy.get("th").contains(D.idep).click();
    cy.get("tbody").eq(1).find("td").eq(1).should("have.text", "INTW9");

    // Testing sort by UE number
    cy.get("th").contains(D.SU).click();
    cy.get("tbody").eq(1).find("td").eq(2).should("have.text", "55");
    cy.get("th").contains(D.SU).click();
    cy.get("tbody").eq(1).find("td").eq(2).should("have.text", "84");

    // Testing search field
    cy.get(".SearchFieldInput").type("bou");
    cy.get("tbody")
      .eq(1)
      .find("td")
      .first()
      .should("have.text", "Boulanger Emilie");
    cy.get("tbody").eq(1).find("tr").should("have.length", 6);

    // Testing return button
    cy.get("a").contains(D.back).click();
    cy.get("#MainScreen");
  });
});
