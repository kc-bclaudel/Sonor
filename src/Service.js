class Service{

	static getSurveys = function(cb){
		fetch('http://localhost:7777/api/campaigns/')
	        .then(res => res.json())
	        .then((data) => {
	          cb(data)
	        })
	        .catch(console.log)
	};

	static getInterviewersByCampaign = function(campaignId, cb){
		fetch('http://localhost:7777/api/campaign/' + campaignId + '/interviewers')
	        .then(res => res.json())
	        .then((data) => {
			  cb(data)
	        })
	        .catch(console.log)
	};

	static getNotAttributedByCampaign = function(campaignId, cb){
		fetch('http://localhost:7777/api/campaign/'+campaignId+'/survey-units/not-attributed')
	        .then(res => res.json())
	        .then((data) => {
			  cb(data)
	        })
	        .catch(console.log)
	};

	static getTotalDemByCampaign = function(campaignId, cb){
		fetch('http://localhost:7777/api/campaign/'+campaignId+'/survey-units/state-count')
	        .then(res => res.json())
	        .then((data) => {
				console.log(data)
			  cb(data)
	        })
	        .catch(console.log)
	};


	static getSurveyUnits = function(campaignId, cb){
		fetch('http://localhost:7777/api/campaign/' + campaignId + '/survey-units')
	        .then(res => res.json())
	        .then((data) => {
	          cb(data)
	        })
	        .catch(console.log)
	};

	static getInterviewers = function(campaignId, cb){
		fetch('http://localhost:7777/api/campaign/' + campaignId + '/interviewers')
	        .then(res => res.json())
	        .then((data) => {
	          cb(data)
	        })
	        .catch(console.log)
	};

	static getInterviewersStateCount = function(campaignId, idep, date, cb){
		fetch('http://localhost:7777/api/campaign/' + campaignId + '/survey-units/interviewer/' + idep + '/state-count?date=' + date)
	        .then(res => res.json())
	        .then((data) => {
	          cb(data)
	        })
	        .catch(console.log)
	};

	static getStateCount = function(campaignId, date, cb){
		fetch('http://localhost:7777/api/campaign/' + campaignId + '/survey-units/state-count?date=' + date)
	        .then(res => res.json())
	        .then((data) => {
	          cb(data)
	        })
	        .catch(console.log)
	};
}



export default Service;
