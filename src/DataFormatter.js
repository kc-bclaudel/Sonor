import Service from './Service.js'
import Utils from './Utils.js';

class DataFormatter{

	constructor(token){
		this.service = new Service(token)
	}

	getDataForMainScreen(cb){
	  this.service.getSurveys((data)=>{
		  data.forEach(survey=>{
			survey.phase = getCampaignPhase(survey.collectionStartDate, survey.collectionEndDate, survey.treatmentEndDate)
			survey.collectionStartDate = Utils.convertToDateString(survey.collectionStartDate)
			survey.collectionEndDate = Utils.convertToDateString(survey.collectionEndDate)
			survey.treatmentEndDate = Utils.convertToDateString(survey.treatmentEndDate)
		  })
		cb(data)
	  });
	}



	getDataForListSU(survey, cb){
	  this.service.getSurveyUnits(survey, (res)=>{
	      const processedData=[]
	      res.forEach(su=>{
	        const suLine = {}
	        suLine.id = su.id
	        suLine.ssech = su.ssech
	        suLine.departement = su.location
	        suLine.city = su.city
	        suLine.interviewer = su.interviewer.firstName + ' ' + su.interviewer.lastName
	        suLine.idep = su.interviewer.id
	        processedData.push(suLine)
	      })
	      cb(processedData)
	  })
	}

	getDataForMonitoringTable(survey, date, cb){
	  const p1 = new Promise((resolve, reject) => {
	    this.service.getInterviewers(survey, (res)=>{
	      const promises = []
	      res.forEach(interviewer=>{
	          promises.push(
	              new Promise((resolve2, reject2) => {
	                this.service.getInterviewersStateCount(survey, interviewer.id, date, (data)=>{resolve2({interviewer: interviewer, stateCount: data})})
	              })
	            )
	      })
	      Promise.all(promises).then(data=>{
	        const processedData=[]
	        data.forEach(data=>{
	          const line = {}
	          line.interviewer = data.interviewer.interviewerFirstName + ' ' + data.interviewer.interviewerLastName
	          formatForMonitoringTable(line, data.stateCount)
	          processedData.push(line)
	        })
	        resolve(processedData)
	      })
	    })
	  });

	  const p2 = new Promise((resolve, reject) => {
	    this.service.getStateCount(survey, date, (data)=>{
	      const totalDem = {}
	      formatForMonitoringTable(totalDem, data.DEM)

	      const totalFrance= {}
	      formatForMonitoringTable(totalFrance, data.France)

	      resolve({dem:totalDem, france:totalFrance})
	    })
	  })

	  Promise.all([p1,p2]).then(data=>{
	    cb({interviewers: data[0], total: data[1]})
	  });
	}


	getDataForCampaignPortal(campaignId, cb){
		const p1 = new Promise((resolve, reject) => {this.service.getInterviewersByCampaign(campaignId, 
		  (data)=>{resolve(data);});
		});
		const p2 = new Promise((resolve, reject) => {this.service.getNotAttributedByCampaign(campaignId, 
		  (data)=>{resolve(data);});
		});
		const p3 = new Promise((resolve, reject) => {this.service.getTotalDemByCampaign(campaignId, 
		  (data)=>{resolve(data);});
		});
		Promise.all([p1,p2,p3]).then(data=>{
		  cb({interviewers: data[0], notAttributed: data[1], total: data[2]})
		});
  	}

}

function formatForMonitoringTable(line, stateCount){
  line.completionRate = calculateCompletionRate(stateCount)
  line.total = stateCount.total
  line.notStarted = stateCount.ansCount
  line.onGoing = calculateOngoing(stateCount)
  line.waitingForIntValidation = stateCount.wftCount + stateCount.wfsCount
  line.intValidated = stateCount.tbrCound
  line.demValidated = stateCount.finCount
  line.preparingContact = stateCount.prcCount
  line.atLeastOneContact = stateCount.aocCount
  line.appointmentTaken = stateCount.apsCount
  line.interviewStarted = stateCount.insCount
}

function calculateCompletionRate(data){
  return (data.total - data.ansCount)/data.total
}

function calculateOngoing(data){
  return data.prcCount + data.aocCount + data.apsCount + data.insCount + data.wftCount + data.wfsCount
}


function getCampaignPhase(collectionStartDate, collectionEndDate, treatmentEndDate){
	let now = new Date().getTime();
	let phase = '';
	if(!collectionStartDate || now < collectionStartDate){
	  phase = 'Affectation initiale';
	} else if(!collectionEndDate || now < collectionEndDate){
	  phase = 'Collecte en cours';
	} else if(!treatmentEndDate || now < treatmentEndDate){
	  phase = 'Collecte terminée';
	} else {
	  phase = 'Traitement terminée';
	}
	return phase;
  }



export default DataFormatter;
