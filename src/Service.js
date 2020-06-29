class Service{

	static getSurveys = function(cb){
		fetch('http://localhost:7777/api/mockMainScreen')
	        .then(res => res.json())
	        .then((data) => {
	          cb(data)
	        })
	        .catch(console.log)
	};

	static getSurveyUnits = function(campaignId, cb){
		fetch('http://localhost:8080/api/survey-units/')
	        .then(res => res.json())
	        .then((data) => {
	          cb(data)
	        })
	        .catch(console.log)
	};

	static getSurveyUnit = function(surveyUnitId, cb){
		fetch('http://localhost:8080/api/survey-unit/' + surveyUnitId)
	        .then(res => res.json())
	        .then((data) => {
	          cb(data)
	        })
	        .catch(console.log)
	};
}



export default Service;
