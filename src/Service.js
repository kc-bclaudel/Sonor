class Service{

	constructor(token){
		this.options = {
			method: 'GET',
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			  })
		}
	}

	getSurveys = function(cb){
		fetch('http://localhost:7777/api/campaigns', this.options)
	        .then(res => res.json())
	        .then((data) => {
	          cb(data)
	        })
	        .catch(console.log)
	};

	getInterviewersByCampaign = function(campaignId, cb){
		fetch('http://localhost:7777/api/campaign/' + campaignId + '/interviewers', this.options)
	        .then(res => res.json())
	        .then((data) => {
			  cb(data)
	        })
	        .catch(console.log)
	};

	getNotAttributedByCampaign = function(campaignId, cb){
		fetch('http://localhost:7777/api/campaign/'+campaignId+'/survey-units/not-attributed', this.options)
	        .then(res => res.json())
	        .then((data) => {
			  cb(data)
	        })
	        .catch(console.log)
	};

	getTotalDemByCampaign = function(campaignId, cb){
		fetch('http://localhost:7777/api/campaign/'+campaignId+'/survey-units/state-count', this.options)
	        .then(res => res.json())
	        .then((data) => {
				console.log(data)
			  cb(data)
	        })
	        .catch(console.log)
	};


	getSurveyUnits = function(campaignId, cb){
		fetch('http://localhost:7777/api/campaign/' + campaignId + '/survey-units', this.options)
	        .then(res => res.json())
	        .then((data) => {
	          cb(data)
	        })
	        .catch(console.log)
	};

	getInterviewers = function(campaignId, cb){
		fetch('http://localhost:7777/api/campaign/' + campaignId + '/interviewers', this.options)
	        .then(res => res.json())
	        .then((data) => {
	          cb(data)
	        })
	        .catch(console.log)
	};

	getInterviewersStateCount = function(campaignId, idep, date, cb){
		fetch('http://localhost:7777/api/campaign/' + campaignId + '/survey-units/interviewer/' + idep + '/state-count?date=' + date, this.options)
	        .then(res => res.json())
	        .then((data) => {
	          cb(data)
	        })
	        .catch(console.log)
	};

	getStateCount = function(campaignId, date, cb){
		fetch('http://localhost:7777/api/campaign/' + campaignId + '/survey-units/state-count?date=' + date, this.options)
	        .then(res => res.json())
	        .then((data) => {
	          cb(data)
	        })
	        .catch(console.log)
	};
}



export default Service;
