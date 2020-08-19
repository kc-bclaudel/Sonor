import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	//header
	api.get('/user', (req, res) => {
		const mockResponse = {
		    firstName:"Chloé",
		    lastName:"Dupont",
		    id: "USR1",
		    organizationUnit: {
			      "id": "OU-NATIONAL",
			      "label": "National organizational unit"
			    },
		    localOrganizationUnits: [
			    {
			      "id": "OU-NORTH",
			      "label": "North region organizational unit"
			    },
			    {
			      "id": "OU-SOUTH",
			      "label": "South region organizational unit"
			    }
		    ]
		}
		
		res.json(mockResponse);
	});

	//header
	api.get('/preferences', (req, res) => {
		const mockResponse = {
		   hello:'hello'
		}
		
		res.status(200).json(mockResponse);
	});

	api.get('/survey-units/state/FIN', (req, res) => {
		const mockResponse = {
		   hello:'hello'
		}
		
		res.status(404).json(mockResponse);
	});

	// main screen
	api.get('/campaigns/', (req, res) => {

		const mockStudyLine1 = [
			    {
        "id": "simpsons2020x00",
        "label": "Survey on the Simpsons tv show 2020",
        "collectionStartDate": 1590504561350,
        "collectionEndDate": 1622035845000,
        "visibilityStartDate": 1577836800000,
        "treatmentEndDate": 1622025045000,
        "allocated": 4,
        "toProcessInterviewer": 0,
        "toAffect": 0,
        "toFollowUp": 0,
        "toReview": 0,
        "finalized": 0,
        "preference": true
    },
    {
        "id": "vqs2021x00",
        "label": "Everyday life and health survey 2021",
        "collectionStartDate": 1590504561350,
        "collectionEndDate": 1594111035000,
        "visibilityStartDate": 1577836800000,
        "treatmentEndDate": 1622025045000,
        "allocated": 4,
        "toProcessInterviewer": 0,
        "toAffect": 0,
        "toFollowUp": 0,
        "toReview": 0,
        "finalized": 0,
        "preference": true
    },
			{
        "id": "simpsosfqns2020x00",
        "label": "Survey on something 2020",
        "collectionStartDate": 1621035845000,
        "collectionEndDate": 1642035845000,
        "visibilityStartDate": 1590504561350,
        "treatmentEndDate": 1672025045000,
        "allocated": 4,
        "toProcessInterviewer": 0,
        "toAffect": 0,
        "toFollowUp": 0,
        "toReview": 0,
        "finalized": 0,
        "preference": true
    },
    {
        "id": "vqs2fsqe021x00",
        "label": "Everyday life and health survey 2022",
        "collectionStartDate": 1590504561350,
        "collectionEndDate": 1594111035000,
        "visibilityStartDate": 1577836800000,
        "treatmentEndDate": 1622025045000,
        "allocated": 4,
        "toProcessInterviewer": 0,
        "toAffect": 0,
        "toFollowUp": 0,
        "toReview": 0,
        "finalized": 0,
        "preference": false
    },
    {
        "id": "simpsonqsdfsqes2020x00",
        "label": "Survey on something else 2020",
        "collectionStartDate": 1590504561350,
        "collectionEndDate": 1622035845000,
        "visibilityStartDate": 1577836800000,
        "treatmentEndDate": 1622025045000,
        "allocated": 4,
        "toProcessInterviewer": 0,
        "toAffect": 0,
        "toFollowUp": 0,
        "toReview": 0,
        "finalized": 0,
        "preference": true
    },
    {
        "id": "vqs2qfsdfsqe021x00",
        "label": "Everyday life and health survey 2026",
        "collectionStartDate": 1590504561350,
        "collectionEndDate": 1594111035000,
        "visibilityStartDate": 1577836800000,
        "treatmentEndDate": 1622025045000,
        "allocated": 4,
        "toProcessInterviewer": 0,
        "toAffect": 0,
        "toFollowUp": 0,
        "toReview": 0,
        "finalized": 0,
        "preference": true
    },
    {
        "id": "simpsonkgs2020x00",
        "label": "Survey on the Simpsons tv show 2021",
        "collectionStartDate": 1590504561350,
        "collectionEndDate": 1594111035000,
        "visibilityStartDate": 1577836800000,
        "treatmentEndDate": 1622025045000,
        "allocated": 4,
        "toProcessInterviewer": 0,
        "toAffect": 0,
        "toFollowUp": 0,
        "toReview": 0,
        "finalized": 0,
        "preference": false
    },
    {
        "id": "vqs202fgd1x00",
        "label": "Everyday life and health survey 2018",
        "collectionStartDate": 1590504561350,
        "collectionEndDate": 1594111035000,
        "visibilityStartDate": 1577836800000,
        "treatmentEndDate": 1622025045000,
        "allocated": 4,
        "toProcessInterviewer": 0,
        "toAffect": 0,
        "toFollowUp": 0,
        "toReview": 0,
        "finalized": 0,
        "preference": true
    },
		]



		res.json(mockStudyLine1);
	});


	api.get('/campaign/:id/interviewers', (req, res) => {

		const mockResponse = [
		    {
		        id:"INTW5",
		        interviewerFirstName: "Chloé",
		        interviewerLastName: "Dupont",
		        surveyUnitCount: 84,
		    },
		    {
		        id:"INTW6",
		        interviewerFirstName: "Jacques",
		        interviewerLastName: "Boulanger",
		        surveyUnitCount: 55
		    },
		    {
		        id:"INTW7",
		        interviewerFirstName: "Thierry",
		        interviewerLastName: "Fabres",
		        surveyUnitCount: 76
		    },
		    {
		        id:"INTW8",
		        interviewerFirstName: "Bertrand",
		        interviewerLastName: "Renard",
		        surveyUnitCount: 84,
		    },
		    {
		        id:"INTW9",
		        interviewerFirstName: "Emilie",
		        interviewerLastName: "Boulanger",
		        surveyUnitCount: 55
		    },
		    {
		        id:"INTW10",
		        interviewerFirstName: "Renée",
		        interviewerLastName: "Dupont",
		        surveyUnitCount: 84,
		    },
		    {
		        id:"INTW11",
		        interviewerFirstName: "Alphonse",
		        interviewerLastName: "Delmarre",
		        surveyUnitCount: 55
		    }
		]
		

		res.json(mockResponse);
	});

	api.get('/campaign/:id/contacts', (req, res) => {

		const mockResponse = {
		    cpos_first_name:"Chloé Dupont",
		    cpos_last_name:"Chloé Dupont",
		    cpos_phone_number: "01 87 69 64 53",
		    deputy_cpos_first_name: "Thierry",
		    deputy_cpos_last_name: "Fabres",
		    deputy_cpos_phone_number:"06 23 55 88 22",
		}
		

		res.json(mockResponse);
	});

	api.get('/campaign/:id/survey-units', (req, res) => {

		const mockResponse = [
		    {
		        id : "1023",
		        ssech : "hgSkR29",
		        location : "95160",
		        city : "MONTMORENCY",
		        interviewer : {
		            id : "INTW5",
		            interviewerFirstName : "Chloé",
		            interviewerLastName : "Dupont"
		        }
		    },
		    {
		        id : "4811",
		        ssech : "dlcB55jdf",
		        location : "90000",
		        city : "BELFORT",
		        interviewer : {
		            id : "INTW6",
		            interviewerFirstName : "Jacques",
		            interviewerLastName : "Boulanger"
		        }
		    },
		    {
		        id : "1024",
		        ssech : "hgSkR29",
		        location : "95160",
		        city : "MONTMORENCY",
		        interviewer : {
		            id : "INTW5",
		            interviewerFirstName : "Chloé",
		            interviewerLastName : "Dupont"
		        }
		    },
		    {
		        id : "4812",
		        ssech : "dlcB55jdf",
		        location : "90000",
		        city : "BELFORT",
		        interviewer : {
		            id : "INTW6",
		            interviewerFirstName : "Jacques",
		            interviewerLastName : "Boulanger"
		        }
		    },
		    {
		        id : "1025",
		        ssech : "hgSkR29",
		        location : "95160",
		        city : "MONTMORENCY",
		        interviewer : {
		            id : "INTW5",
		            interviewerFirstName : "Chloé",
		            interviewerLastName : "Dupont"
		        }
		    },
		    {
		        id : "4813",
		        ssech : "dlcB55jdf",
		        location : "90000",
		        city : "BELFORT",
		        interviewer : {
		            id : "INTW6",
		            interviewerFirstName : "Jacques",
		            interviewerLastName : "Boulanger"
		        }
		    },
		    {
		        id : "1027",
		        ssech : "hgSkR29",
		        location : "95160",
		        city : "MONTMORENCY",
		        interviewer : {
		            id : "INTW5",
		            interviewerFirstName : "Chloé",
		            interviewerLastName : "Dupont"
		        }
		    },
		    {
		        id : "4815",
		        ssech : "dlcB55jdf",
		        location : "90000",
		        city : "BELFORT",
		        interviewer : {
		            id : "INTW7",
		            interviewerFirstName : "Thierry",
		            interviewerLastName : "Fabres"
		        }
		    },
		    {
		        id : "1028",
		        ssech : "hgSkR29",
		        location : "95160",
		        city : "MONTMORENCY",
		        interviewer : {
		            id : "INTW5",
		            interviewerFirstName : "Chloé",
		            interviewerLastName : "Dupont"
		        }
		    },
		    {
		        id : "4816",
		        ssech : "dlcB55jdf",
		        location : "90000",
		        city : "BELFORT",
		        interviewer : {
		            id : "INTW6",
		            interviewerFirstName : "Jacques",
		            interviewerLastName : "Boulanger"
		        }
		    },
		    {
		        id : "1029",
		        ssech : "hgSkR29",
		        location : "95160",
		        city : "MONTMORENCY",
		        interviewer : {
		            id : "INTW7",
		            interviewerFirstName : "Thierry",
		            interviewerLastName : "Fabres"
		        }
		    },
		    {
		        id : "4817",
		        ssech : "dlcB55jdf",
		        location : "90000",
		        city : "BELFORT",
		        interviewer : {
		            id : "INTW6",
		            interviewerFirstName : "Jacques",
		            interviewerLastName : "Boulanger"
		        }
		    },
		    {
		        id : "1030",
		        ssech : "hgSkR29",
		        location : "95160",
		        city : "MONTMORENCY",
		        interviewer : {
		            id : "INTW5",
		            interviewerFirstName : "Chloé",
		            interviewerLastName : "Dupont"
		        }
		    },
		    {
		        id : "4818",
		        ssech : "dlcB55jdf",
		        location : "90000",
		        city : "BELFORT",
		        interviewer : {
		            id : "INTW6",
		            interviewerFirstName : "Jacques",
		            interviewerLastName : "Boulanger"
		        }
		    },
		    {
		        id : "1032",
		        ssech : "hgSkR29",
		        location : "95160",
		        city : "MONTMORENCY",
		        interviewer : {
		            id : "INTW5",
		            interviewerFirstName : "Chloé",
		            interviewerLastName : "Dupont"
		        }
		    },
		    {
		        id : "4819",
		        ssech : "dlcB55jdf",
		        location : "90000",
		        city : "BELFORT",
		        interviewer : {
		            id : "INTW6",
		            interviewerFirstName : "Jacques",
		            interviewerLastName : "Boulanger"
		        }
		    }
		]
		

		res.json(mockResponse);
	});

	api.get('/survey-unit/:id/states', (req, res) => {

		const mockResponse = {
      id: 'ue432',
      states: [
        {
          id : 1, 
          date : 1596188129587,
          type : 'ANS',
        },
        {
          id : 2, 
          date : 1596120310000,
          type : 'ANS',
        },
        {
          id : 3, 
          date : 1595657530000,
          type : 'AOC',
        },
      ]
    }
		

		res.json(mockResponse);
	});
	
	api.get('/campaign/:id/survey-units?state=FIN', (req, res) => {

		const mockResponse = [
		    {
				campaignLabel : "simpsons2020x00",
		        id : "1023",
		        ssech : "hgSkR29",
		        location : "95160",
		        city : "MONTMORENCY",
		        interviewer : {
		            id : "INTW5",
		            interviewerFirstName : "Chloé",
		            interviewerLastName : "Berlin"
		        }
		    },
		    {
				campaignLabel : "simpsons2020x00",
		        id : "4811",
		        ssech : "dlcB55jdf",
		        location : "90000",
		        city : "BELFORT",
		        interviewer : {
		            id : "INTW6",
		            interviewerFirstName : "Jacques",
		            interviewerLastName : "Boulanger"
		        }
		    },
		    {
				campaignLabel : "simpsons2020x00",
		        id : "1023",
		        ssech : "hgSkR29",
		        location : "95160",
		        city : "MONTMORENCY",
		        interviewer : {
		            id : "INTW5",
		            interviewerFirstName : "Chloé",
		            interviewerLastName : "Berlin"
		        }
		    },
		    {
				campaignLabel : "simpsons2020x00",
		        id : "4811",
		        ssech : "dlcB55jdf",
		        location : "90000",
		        city : "BELFORT",
		        interviewer : {
		            id : "INTW6",
		            interviewerFirstName : "Jacques",
		            interviewerLastName : "Boulanger"
		        }
		    },
		    {
				campaignLabel : "simpsons2020x00",
		        id : "1023",
		        ssech : "hgSkR29",
		        location : "95160",
		        city : "MONTMORENCY",
		        interviewer : {
		            id : "INTW5",
		            interviewerFirstName : "Chloé",
		            interviewerLastName : "Berlin"
		        }
		    },
		    {
				campaignLabel : "simpsons2020x00",
		        id : "4811",
		        ssech : "dlcB55jdf",
		        location : "90000",
		        city : "BELFORT",
		        interviewer : {
		            id : "INTW6",
		            interviewerFirstName : "Jacques",
		            interviewerLastName : "Boulanger"
		        }
		    },
		    {
				campaignLabel : "simpsons2020x00",
		        id : "1023",
		        ssech : "hgSkR29",
		        location : "95160",
		        city : "MONTMORENCY",
		        interviewer : {
		            id : "INTW5",
		            interviewerFirstName : "Chloé",
		            interviewerLastName : "Berlin"
		        }
		    },
		    {
				campaignLabel : "simpsons2020x00",
		        id : "4811",
		        ssech : "dlcB55jdf",
		        location : "90000",
		        city : "BELFORT",
		        interviewer : {
		            id : "INTW6",
		            interviewerFirstName : "Jacques",
		            interviewerLastName : "Boulanger"
		        }
		    }
		]
		
		res.json(mockResponse);
	});

	api.get('/campaign/:id/survey-units/not-attributed', (req, res) => {

		const mockResponse = {
			    count: 14,
			}
		

		res.json(mockResponse);
	});


	api.get('/campaign/:id/survey-units/interviewer/:idep/state-count', (req, res) => {
		const date = new Date(req.query.date)
		const day = date.getDay()
		const month = date.getMonth()

		let mockResponse;

		if (req.params.idep.includes('5')){
			mockResponse = {
				nnsCount: 0,
			    ansCount : day,
			    vicCount: 3,
			    prcCount : 4,
			    aocCount : month,
			    apsCount : month,
			    insCount : 3,
			    wftCount : 2,
			    wfsCount : 1,
			    tbrCount : 9,
			    finCount : 7,
			    nviCount : 1,
			    nvmCount : 8,
			    total : 96
			}

		} else {

			mockResponse = {
				nnsCount: 0,
			    ansCount : day,
			    vicCount: 3,
			    prcCount : 29,
			    aocCount : month,
			    apsCount : month,
			    insCount : 5,
			    wftCount : 0,
			    wfsCount : 0,
			    tbrCount : 2,
			    finCount : 1,
			    nviCount : 3,
			    nvmCount : 0,
			    total : 104
			}

		}
		
		

		res.json(mockResponse);
	});


	api.get('/campaign/:id/survey-units/state-count', (req, res) => {

		const date = new Date(req.query.date)
		const day = date.getDay()
		const month = date.getMonth()

		const mockResponse = 
					{
				    organizationUnits: [
				        {
                idDem: 'OU-SOUTH',
                labelDem: "South region organizational unit",
				        isLocal: true,
				        nnsCount : 22,
				        ansCount : day,
				        vicCount : day,
				        prcCount : 29,
				        aocCount : 30,
				        apsCount : day,
				        insCount : 5,
				        wftCount : 0,
				        wfsCount : 0,
				        tbrCount : 2,
				        finCount : 1,
				        nviCount : 3,
				        nvmCount : 0,
				        total : 104
				        },
				        {
                idDem: 'OU-NORTH',
                labelDem: "North region organizational unit",
				        isLocal: true,
				        nnsCount : 22,
				        ansCount : day,
				        vicCount : 22,
				        prcCount : month,
				        aocCount : 30,
				        apsCount : 12,
				        insCount : 5,
				        wftCount : month,
				        wfsCount : 0,
				        tbrCount : 2,
				        finCount : 1,
				        nviCount : 3,
				        nvmCount : 0,
				        total : 104
				        },
				        {
                idDem: 'OU-NATIONAL',
                labelDem: "National organizational unit",
				        isLocal: false,
				        nnsCount : 22,
				        ansCount : day,
				        vicCount : 22,
				        prcCount : month,
				        aocCount : 30,
				        apsCount : 12,
				        insCount : 5,
				        wftCount : 0,
				        wfsCount : 0,
				        tbrCount : 2,
				        finCount : 1,
				        nviCount : 3,
				        nvmCount : 0,
				        total : 104
				        }
				    ],
				    france: {
				        nnsCount : 22,
				        ansCount : 22,
				        vicCount : month,
				        prcCount : 29,
				        aocCount : day,
				        apsCount : day,
				        insCount : 5,
				        wftCount : 0,
				        wfsCount : 0,
				        tbrCount : 2,
				        finCount : 1,
				        nviCount : 3,
				        nvmCount : 0,
				        total : 104
				    }
				}


		

		res.json(mockResponse);
	});


	
	return api;
}
