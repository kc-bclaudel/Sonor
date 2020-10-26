import { version } from "../../package.json";
import { Router } from "express";
import facets from "./facets";

export default ({ config, db }) => {
  let api = Router();

  // mount the facets resource
  api.use("/facets", facets({ config, db }));

  //header
  api.get("/user", (req, res) => {
    const mockResponse = {
      firstName: "Chloé",
      lastName: "Dupont",
      id: "USR1",
      organizationUnit: {
        id: "OU-NATIONAL",
        label: "National organizational unit",
      },
      localOrganizationUnits: [
        {
          id: "OU-NORTH",
          label: "North region organizational unit",
        },
        {
          id: "OU-SOUTH",
          label: "South region organizational unit",
        },
      ],
    };

    res.json(mockResponse);
  });

  //header
  api.get("/preferences", (req, res) => {
    const mockResponse = {
      hello: "hello",
    };

    res.status(200).json(mockResponse);
  });

  api.get("/survey-units/state/FIN", (req, res) => {
    const mockResponse = {
      hello: "hello",
    };

    res.status(404).json(mockResponse);
  });

  // main screen
  api.get("/campaigns/", (req, res) => {
    const mockStudyLine1 = [
      {
        id: "simpsons2020x00",
        label: "Survey on the Simpsons tv show 2020",
        managementStartDate: 1576801000000,
        interviewerStartDate: 1575937000000,
        identificationPhaseStartDate: 1577233000000,
        collectionStartDate: 1577837800000,
        collectionEndDate: 1640996200000,
        endDate: 1641514600000,
        allocated: 4,
        toProcessInterviewer: 0,
        toAffect: 0,
        toFollowUp: 0,
        toReview: 0,
        finalized: 0,
        preference: true,
      },
      {
        id: "vqs2021x00",
        label: "Everyday life and health survey 2021",
        managementStartDate: 1576801000000,
        interviewerStartDate: 1575937000000,
        identificationPhaseStartDate: 1577233000000,
        collectionStartDate: 1577837800000,
        collectionEndDate: 1640996200000,
        endDate: 1641514600000,
        allocated: 4,
        toProcessInterviewer: 0,
        toAffect: 0,
        toFollowUp: 0,
        toReview: 0,
        finalized: 0,
        preference: true,
      },
      {
        id: "simpsosfqns2020x00",
        label: "Survey on something 2020",
        managementStartDate: 1576801000000,
        interviewerStartDate: 1575937000000,
        identificationPhaseStartDate: 1577233000000,
        collectionStartDate: 1577837800000,
        collectionEndDate: 1640996200000,
        endDate: 1641514600000,
        allocated: 4,
        toProcessInterviewer: 0,
        toAffect: 0,
        toFollowUp: 0,
        toReview: 0,
        finalized: 0,
        preference: true,
      },
      {
        id: "vqs2fsqe021x00",
        label: "Everyday life and health survey 2022",
        managementStartDate: 1576801000000,
        interviewerStartDate: 1575937000000,
        identificationPhaseStartDate: 1577233000000,
        collectionStartDate: 1577837800000,
        collectionEndDate: 1640996200000,
        endDate: 1641514600000,
        allocated: 4,
        toProcessInterviewer: 0,
        toAffect: 0,
        toFollowUp: 0,
        toReview: 0,
        finalized: 0,
        preference: false,
      },
      {
        id: "simpsonqsdfsqes2020x00",
        label: "Survey on something else 2020",
        managementStartDate: 1576801000000,
        interviewerStartDate: 1575937000000,
        identificationPhaseStartDate: 1577233000000,
        collectionStartDate: 1577837800000,
        collectionEndDate: 1640996200000,
        endDate: 1641514600000,
        allocated: 4,
        toProcessInterviewer: 0,
        toAffect: 0,
        toFollowUp: 0,
        toReview: 0,
        finalized: 0,
        preference: true,
      },
      {
        id: "vqs2qfsdfsqe021x00",
        label: "Everyday life and health survey 2026",
        managementStartDate: 1576801000000,
        interviewerStartDate: 1575937000000,
        identificationPhaseStartDate: 1577233000000,
        collectionStartDate: 1577837800000,
        collectionEndDate: 1640996200000,
        endDate: 1641514600000,
        allocated: 4,
        toProcessInterviewer: 0,
        toAffect: 0,
        toFollowUp: 0,
        toReview: 0,
        finalized: 0,
        preference: true,
      },
      {
        id: "simpsonkgs2020x00",
        label: "Survey on the Simpsons tv show 2021",
        managementStartDate: 1576801000000,
        interviewerStartDate: 1575937000000,
        identificationPhaseStartDate: 1577233000000,
        collectionStartDate: 1577837800000,
        collectionEndDate: 1640996200000,
        endDate: 1641514600000,
        allocated: 4,
        toProcessInterviewer: 0,
        toAffect: 0,
        toFollowUp: 0,
        toReview: 0,
        finalized: 0,
        preference: false,
      },
      {
        id: "vqs202fgd1x00",
        label: "Everyday life and health survey 2018",
        managementStartDate: 1576801000000,
        interviewerStartDate: 1575937000000,
        identificationPhaseStartDate: 1577233000000,
        collectionStartDate: 1577837800000,
        collectionEndDate: 1640996200000,
        endDate: 1641514600000,
        allocated: 4,
        toProcessInterviewer: 0,
        toAffect: 0,
        toFollowUp: 0,
        toReview: 0,
        finalized: 0,
        preference: true,
      },
    ];

    res.json(mockStudyLine1);
  });

  api.get("/campaign/:id/interviewers", (req, res) => {
    const mockResponse = [
      {
        id: "INTW5",
        interviewerFirstName: "Chloé",
        interviewerLastName: "Dupont",
        surveyUnitCount: 84,
      },
      {
        id: "INTW6",
        interviewerFirstName: "Jacques",
        interviewerLastName: "Boulanger",
        surveyUnitCount: 55,
      },
      {
        id: "INTW7",
        interviewerFirstName: "Thierry",
        interviewerLastName: "Fabres",
        surveyUnitCount: 76,
      },
      {
        id: "INTW8",
        interviewerFirstName: "Bertrand",
        interviewerLastName: "Renard",
        surveyUnitCount: 84,
      },
      {
        id: "INTW9",
        interviewerFirstName: "Emilie",
        interviewerLastName: "Boulanger",
        surveyUnitCount: 55,
      },
      {
        id: "INTW10",
        interviewerFirstName: "Renée",
        interviewerLastName: "Dupont",
        surveyUnitCount: 84,
      },
      {
        id: "INTW11",
        interviewerFirstName: "Alphonse",
        interviewerLastName: "Delmarre",
        surveyUnitCount: 55,
      },
    ];

    res.json(mockResponse);
  });

  api.get("/campaign/:id/survey-units", (req, res) => {
    const mockResponse = [
      {
        id: "1023",
        ssech: "hgSkR29",
        location: "95160",
        city: "MONTMORENCY",
        interviewer: {
          id: "INTW5",
          interviewerFirstName: "Chloé",
          interviewerLastName: "Dupont",
        },
      },
      {
        id: "4811",
        ssech: "dlcB55jdf",
        location: "90000",
        city: "BELFORT",
        interviewer: {
          id: "INTW6",
          interviewerFirstName: "Jacques",
          interviewerLastName: "Boulanger",
        },
      },
      {
        id: "1024",
        ssech: "hgSkR29",
        location: "95160",
        city: "MONTMORENCY",
        interviewer: {
          id: "INTW5",
          interviewerFirstName: "Chloé",
          interviewerLastName: "Dupont",
        },
      },
      {
        id: "4812",
        ssech: "dlcB55jdf",
        location: "90000",
        city: "BELFORT",
        interviewer: {
          id: "INTW6",
          interviewerFirstName: "Jacques",
          interviewerLastName: "Boulanger",
        },
      },
      {
        id: "1025",
        ssech: "hgSkR29",
        location: "95160",
        city: "MONTMORENCY",
        interviewer: {
          id: "INTW5",
          interviewerFirstName: "Chloé",
          interviewerLastName: "Dupont",
        },
      },
      {
        id: "4813",
        ssech: "dlcB55jdf",
        location: "90000",
        city: "BELFORT",
        interviewer: {
          id: "INTW6",
          interviewerFirstName: "Jacques",
          interviewerLastName: "Boulanger",
        },
      },
      {
        id: "1027",
        ssech: "hgSkR29",
        location: "95160",
        city: "MONTMORENCY",
        interviewer: {
          id: "INTW5",
          interviewerFirstName: "Chloé",
          interviewerLastName: "Dupont",
        },
      },
      {
        id: "4815",
        ssech: "dlcB55jdf",
        location: "90000",
        city: "BELFORT",
        interviewer: {
          id: "INTW7",
          interviewerFirstName: "Thierry",
          interviewerLastName: "Fabres",
        },
      },
      {
        id: "1028",
        ssech: "hgSkR29",
        location: "95160",
        city: "MONTMORENCY",
        interviewer: {
          id: "INTW5",
          interviewerFirstName: "Chloé",
          interviewerLastName: "Dupont",
        },
      },
      {
        id: "4816",
        ssech: "dlcB55jdf",
        location: "90000",
        city: "BELFORT",
        interviewer: {
          id: "INTW6",
          interviewerFirstName: "Jacques",
          interviewerLastName: "Boulanger",
        },
      },
      {
        id: "1029",
        ssech: "hgSkR29",
        location: "95160",
        city: "MONTMORENCY",
        interviewer: {
          id: "INTW7",
          interviewerFirstName: "Thierry",
          interviewerLastName: "Fabres",
        },
      },
      {
        id: "4817",
        ssech: "dlcB55jdf",
        location: "90000",
        city: "BELFORT",
        interviewer: {
          id: "INTW6",
          interviewerFirstName: "Jacques",
          interviewerLastName: "Boulanger",
        },
      },
      {
        id: "1030",
        ssech: "hgSkR29",
        location: "95160",
        city: "MONTMORENCY",
        interviewer: {
          id: "INTW5",
          interviewerFirstName: "Chloé",
          interviewerLastName: "Dupont",
        },
      },
      {
        id: "4818",
        ssech: "dlcB55jdf",
        location: "90000",
        city: "BELFORT",
        interviewer: {
          id: "INTW6",
          interviewerFirstName: "Jacques",
          interviewerLastName: "Boulanger",
        },
      },
      {
        id: "1032",
        ssech: "hgSkR29",
        location: "95160",
        city: "MONTMORENCY",
        interviewer: {
          id: "INTW5",
          interviewerFirstName: "Chloé",
          interviewerLastName: "Dupont",
        },
      },
      {
        id: "4819",
        ssech: "dlcB55jdf",
        location: "90000",
        city: "BELFORT",
        interviewer: {
          id: "INTW6",
          interviewerFirstName: "Jacques",
          interviewerLastName: "Boulanger",
        },
      },
    ];

    res.json([
      ...mockResponse,
      ...mockResponse,
      ...mockResponse,
      ...mockResponse,
      ...mockResponse,
      ...mockResponse,
      ...mockResponse,
      ...mockResponse,
    ]);
  });

  api.get("/survey-unit/:id/states", (req, res) => {
    const mockResponse = {
      id: "ue432",
      states: [
        {
          id: 1,
          date: 1596188129587,
          type: "ANS",
        },
        {
          id: 2,
          date: 1596120310000,
          type: "ANS",
        },
        {
          id: 3,
          date: 1595657530000,
          type: "AOC",
        },
      ],
    };

    res.json(mockResponse);
  });

  api.get("/campaign/:id/survey-units?state=FIN", (req, res) => {
    const mockResponse = [
      {
        campaignLabel: "simpsons2020x00",
        id: "1023",
        ssech: "hgSkR29",
        location: "95160",
        city: "MONTMORENCY",
        interviewer: {
          id: "INTW5",
          interviewerFirstName: "Chloé",
          interviewerLastName: "Berlin",
        },
      },
      {
        campaignLabel: "simpsons2020x00",
        id: "4811",
        ssech: "dlcB55jdf",
        location: "90000",
        city: "BELFORT",
        interviewer: {
          id: "INTW6",
          interviewerFirstName: "Jacques",
          interviewerLastName: "Boulanger",
        },
      },
      {
        campaignLabel: "simpsons2020x00",
        id: "1023",
        ssech: "hgSkR29",
        location: "95160",
        city: "MONTMORENCY",
        interviewer: {
          id: "INTW5",
          interviewerFirstName: "Chloé",
          interviewerLastName: "Berlin",
        },
      },
      {
        campaignLabel: "simpsons2020x00",
        id: "4811",
        ssech: "dlcB55jdf",
        location: "90000",
        city: "BELFORT",
        interviewer: {
          id: "INTW6",
          interviewerFirstName: "Jacques",
          interviewerLastName: "Boulanger",
        },
      },
      {
        campaignLabel: "simpsons2020x00",
        id: "1023",
        ssech: "hgSkR29",
        location: "95160",
        city: "MONTMORENCY",
        interviewer: {
          id: "INTW5",
          interviewerFirstName: "Chloé",
          interviewerLastName: "Berlin",
        },
      },
      {
        campaignLabel: "simpsons2020x00",
        id: "4811",
        ssech: "dlcB55jdf",
        location: "90000",
        city: "BELFORT",
        interviewer: {
          id: "INTW6",
          interviewerFirstName: "Jacques",
          interviewerLastName: "Boulanger",
        },
      },
      {
        campaignLabel: "simpsons2020x00",
        id: "1023",
        ssech: "hgSkR29",
        location: "95160",
        city: "MONTMORENCY",
        interviewer: {
          id: "INTW5",
          interviewerFirstName: "Chloé",
          interviewerLastName: "Berlin",
        },
      },
      {
        campaignLabel: "simpsons2020x00",
        id: "4811",
        ssech: "dlcB55jdf",
        location: "90000",
        city: "BELFORT",
        interviewer: {
          id: "INTW6",
          interviewerFirstName: "Jacques",
          interviewerLastName: "Boulanger",
        },
      },
    ];

    res.json(mockResponse);
  });

  api.get("/campaign/:id/survey-units/not-attributed", (req, res) => {
    const mockResponse = {
      count: 0,
    };

    res.json(mockResponse);
  });

  api.get("/campaign/:id/questionnaire-id", (req, res) => {
    const mockResponse = {
      questionnaireId: "QXT55",
    };

    res.json(mockResponse);
  });

  api.get("/campaign/:id/survey-units/abandoned", (req, res) => {
    const mockResponse = {
      count: 0,
    };
    res.json(mockResponse);
  });

  api.get(
    "/campaign/:id/survey-units/interviewer/:idep/state-count",
    (req, res) => {
      const date = new Date(req.query.date);
      const day = date.getDay();
      const month = date.getMonth();

      let mockResponse;

      mockResponse = {
        nvmCount: 22,
        nnsCount: 22,
        anvCount: 22,
        vinCount: 22,
        vicCount: 22,
        prcCount: 29,
        aocCount: 30,
        apsCount: 12,
        insCount: 5,
        wftCount: 0,
        wfsCount: 0,
        tbrCount: 2,
        finCount: 1,
        qnaCount: 3,
        qnaFinCount: 3,
        nvaCount: 0,
        total: 104,
      };

      res.json(mockResponse);
    }
  );

  api.get("/campaign/:id/survey-units/state-count", (req, res) => {
    const date = new Date(Number(req.query.date));
    const day = date.getDay();
    const month = date.getMonth();

    const mockResponse = {
      organizationUnits: [
        {
          idDem: "OU-SOUTH",
          labelDem: "South region organizational unit",
          isLocal: true,
          nvmCount: 22,
          nnsCount: 22,
          anvCount: 22,
          vinCount: 22,
          vicCount: 22,
          prcCount: 29,
          aocCount: 30,
          apsCount: 12,
          insCount: 5,
          wftCount: 0,
          wfsCount: 0,
          tbrCount: 2,
          finCount: 1,
          qnaCount: 3,
          qnaFinCount: 3,
          nvaCount: 0,
          total: 104,
        },
        {
          idDem: "OU-NORTH",
          labelDem: "North region organizational unit",
          isLocal: true,
          nvmCount: 22,
          nnsCount: 22,
          anvCount: 22,
          vinCount: 22,
          vicCount: 22,
          prcCount: 29,
          aocCount: 30,
          apsCount: 12,
          insCount: 5,
          wftCount: 0,
          wfsCount: 0,
          tbrCount: 2,
          finCount: 1,
          qnaCount: 3,
          qnaFinCount: 3,
          nvaCount: 0,
          total: 104,
        },
        {
          idDem: "OU-NATIONAL",
          labelDem: "National organizational unit",
          isLocal: false,
          nvmCount: 22,
          nnsCount: 22,
          anvCount: 22,
          vinCount: 22,
          vicCount: 22,
          prcCount: 29,
          aocCount: 30,
          apsCount: 12,
          insCount: 5,
          wftCount: 0,
          wfsCount: 0,
          tbrCount: 2,
          finCount: 1,
          qnaCount: 3,
          qnaFinCount: 3,
          nvaCount: 0,
          total: 104,
        },
      ],
      france: {
        nvmCount: 22,
        nnsCount: 22,
        anvCount: 22,
        vinCount: 22,
        vicCount: 22,
        prcCount: 29,
        aocCount: 30,
        apsCount: 12,
        insCount: 5,
        wftCount: 0,
        wfsCount: 0,
        tbrCount: 2,
        finCount: 1,
        qnaCount: 3,
        qnaFinCount: 3,
        nvaCount: 0,
        total: 104,
      },
    };

    res.json(mockResponse);
  });

  api.get("/campaigns/survey-units/state-count", (req, res) => {
    const date = new Date(Number(req.query.date));
    const day = date.getDay();
    const month = date.getMonth();

    const mockResponse = [
      {
        campaign: {
          id: "simpsons2020x00",
          label: "Survey on the Simpsons tv show 2020",
        },
        nvmCount: 22,
        nnsCount: 22,
        anvCount: 22,
        vinCount: 22,
        vicCount: 22,
        prcCount: 29,
        aocCount: 30,
        apsCount: 12,
        insCount: 5,
        wftCount: 0,
        wfsCount: 0,
        tbrCount: 2,
        finCount: 1,
        qnaCount: 3,
        qnaFinCount: 3,
        nvaCount: 0,
        total: 104,
      },
      {
        campaign: {
          id: "simpsosfqns2020x00",
          label: "Survey on something 2020",
        },
        nvmCount: 22,
        nnsCount: 22,
        anvCount: 22,
        vinCount: 22,
        vicCount: 22,
        prcCount: 29,
        aocCount: 30,
        apsCount: 12,
        insCount: 5,
        wftCount: 0,
        wfsCount: 0,
        tbrCount: 2,
        finCount: 1,
        qnaCount: 3,
        qnaFinCount: 3,
        nvaCount: 0,
        total: 104,
      },
      {
        campaign: {
          id: "vqs2fsqe021x00",
          label: "Everyday life and health survey 2022",
        },
        nvmCount: 22,
        nnsCount: 22,
        anvCount: 22,
        vinCount: 22,
        vicCount: 22,
        prcCount: 29,
        aocCount: 30,
        apsCount: 12,
        insCount: 5,
        wftCount: 0,
        wfsCount: 0,
        tbrCount: 2,
        finCount: 1,
        qnaCount: 3,
        qnaFinCount: 3,
        nvaCount: 0,
        total: 104,
      },
      {
        campaign: {
          id: "simpsonqsdfsqes2020x00",
          label: "Survey on something else 2020",
        },
        nvmCount: 22,
        nnsCount: 22,
        anvCount: 22,
        vinCount: 22,
        vicCount: 22,
        prcCount: 29,
        aocCount: 30,
        apsCount: 12,
        insCount: 5,
        wftCount: 0,
        wfsCount: 0,
        tbrCount: 2,
        finCount: 1,
        qnaCount: 3,
        qnaFinCount: 3,
        nvaCount: 0,
        total: 104,
      },
      {
        campaign: {
          id: "vqs2qfsdfsqe021x00",
          label: "Everyday life and health survey 2026",
        },
        nvmCount: 22,
        nnsCount: 22,
        anvCount: 22,
        vinCount: 22,
        vicCount: 22,
        prcCount: 29,
        aocCount: 30,
        apsCount: 12,
        insCount: 5,
        wftCount: 0,
        wfsCount: 0,
        tbrCount: 2,
        finCount: 1,
        qnaCount: 3,
        qnaFinCount: 3,
        nvaCount: 0,
        total: 104,
      },
      {
        campaign: {
          id: "simpsonkgs2020x00",
          label: "Survey on the Simpsons tv show 2021",
        },
        nvmCount: 22,
        nnsCount: 22,
        anvCount: 22,
        vinCount: 22,
        vicCount: 22,
        prcCount: 29,
        aocCount: 30,
        apsCount: 12,
        insCount: 5,
        wftCount: 0,
        wfsCount: 0,
        tbrCount: 2,
        finCount: 1,
        qnaCount: 3,
        qnaFinCount: 3,
        nvaCount: 0,
        total: 104,
      },
      {
        campaign: {
          id: "vqs202fgd1x00",
          label: "Everyday life and health survey 2018",
        },
        nvmCount: 22,
        nnsCount: 22,
        anvCount: 22,
        vinCount: 22,
        vicCount: 22,
        prcCount: 29,
        aocCount: 30,
        apsCount: 12,
        insCount: 5,
        wftCount: 0,
        wfsCount: 0,
        tbrCount: 2,
        finCount: 1,
        qnaCount: 3,
        qnaFinCount: 3,
        nvaCount: 0,
        total: 104,
      },
    ];
    res.json(mockResponse);
  });

  api.get("/interviewers/survey-units/state-count", (req, res) => {
    const date = new Date(Number(req.query.date));
    const day = date.getDay();
    const month = date.getMonth();

    const mockResponse = [
      {
        interviewer: {
          id: "INTW5",
          interviewerFirstName: "Chloé",
          interviewerLastName: "Dupont",
        },
        nvmCount: 22,
        nnsCount: 22,
        anvCount: 22,
        vinCount: 22,
        vicCount: 22,
        prcCount: 29,
        aocCount: 30,
        apsCount: 12,
        insCount: 5,
        wftCount: 0,
        wfsCount: 0,
        tbrCount: 2,
        finCount: 1,
        qnaCount: 3,
        qnaFinCount: 3,
        nvaCount: 0,
        total: 104,
      },
      {
        interviewer: {
          id: "INTW6",
          interviewerFirstName: "Jacques",
          interviewerLastName: "Boulanger",
        },
        nvmCount: 22,
        nnsCount: 22,
        anvCount: 22,
        vinCount: 22,
        vicCount: 22,
        prcCount: 29,
        aocCount: 30,
        apsCount: 12,
        insCount: 5,
        wftCount: 0,
        wfsCount: 0,
        tbrCount: 2,
        finCount: 1,
        qnaCount: 3,
        qnaFinCount: 3,
        nvaCount: 0,
        total: 104,
      },
      {
        interviewer: {
          id: "INTW7",
          interviewerFirstName: "Thierry",
          interviewerLastName: "Fabres",
        },
        nvmCount: 22,
        nnsCount: 22,
        anvCount: 22,
        vinCount: 22,
        vicCount: 22,
        prcCount: 29,
        aocCount: 30,
        apsCount: 12,
        insCount: 5,
        wftCount: 0,
        wfsCount: 0,
        tbrCount: 2,
        finCount: 1,
        qnaCount: 3,
        qnaFinCount: 3,
        nvaCount: 0,
        total: 104,
      },
      {
        interviewer: {
          id: "INTW8",
          interviewerFirstName: "Bertrand",
          interviewerLastName: "Renard",
        },
        nvmCount: 22,
        nnsCount: 22,
        anvCount: 22,
        vinCount: 22,
        vicCount: 22,
        prcCount: 29,
        aocCount: 30,
        apsCount: 12,
        insCount: 5,
        wftCount: 0,
        wfsCount: 0,
        tbrCount: 2,
        finCount: 1,
        qnaCount: 3,
        qnaFinCount: 3,
        nvaCount: 0,
        total: 104,
      },
      {
        interviewer: {
          id: "INTW9",
          interviewerFirstName: "Emilie",
          interviewerLastName: "Boulanger",
        },
        nvmCount: 22,
        nnsCount: 22,
        anvCount: 22,
        vinCount: 22,
        vicCount: 22,
        prcCount: 29,
        aocCount: 30,
        apsCount: 12,
        insCount: 5,
        wftCount: 0,
        wfsCount: 0,
        tbrCount: 2,
        finCount: 1,
        qnaCount: 3,
        qnaFinCount: 3,
        nvaCount: 0,
        total: 104,
      },
      {
        interviewer: {
          id: "INTW10",
          interviewerFirstName: "Renée",
          interviewerLastName: "Dupont",
        },
        nvmCount: 22,
        nnsCount: 22,
        anvCount: 22,
        vinCount: 22,
        vicCount: 22,
        prcCount: 29,
        aocCount: 30,
        apsCount: 12,
        insCount: 5,
        wftCount: 0,
        wfsCount: 0,
        tbrCount: 2,
        finCount: 1,
        qnaCount: 3,
        qnaFinCount: 3,
        nvaCount: 0,
        total: 104,
      },
      {
        interviewer: {
          id: "INTW11",
          interviewerFirstName: "Alphonse",
          interviewerLastName: "Delmarre",
        },
        nvmCount: 22,
        nnsCount: 22,
        anvCount: 22,
        vinCount: 22,
        vicCount: 22,
        prcCount: 29,
        aocCount: 30,
        apsCount: 12,
        insCount: 5,
        wftCount: 0,
        wfsCount: 0,
        tbrCount: 2,
        finCount: 1,
        qnaCount: 3,
        qnaFinCount: 3,
        nvaCount: 0,
        total: 104,
      },
    ];
    res.json(mockResponse);
  });

  return api;
};
