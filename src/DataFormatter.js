import Service from './Service.js'

class DataFormatter{

	static getDataForMainScreen(cb){
	  Service.getSurveys((data)=>{
	    cb(data)
	  });
	}

	static getDataForListSU(survey, cb){
	  Service.getSurveyUnits(survey, (res)=>{
	      const processedData=[]
	      res.forEach(su=>{
	        const suLine = {}
	        suLine.id = su.id
	        suLine.ssech = su.ssech
	        suLine.departement = su.location
	        suLine.city = su.city
	        suLine.interviewer = su.interviewer.first_name + ' ' + su.interviewer.last_name
	        suLine.idep = su.interviewer.idep
	        processedData.push(suLine)
	      })
	      cb(processedData)
	  })
	}

	static getDataForMonitoringTable(survey, cb){
	  const p1 = new Promise((resolve, reject) => {
	    Service.getInterviewers(survey, (res)=>{
	      const promises = []
	      res.forEach(interviewer=>{
	          promises.push(
	              new Promise((resolve2, reject2) => {
	                Service.getInterviewersStateCount(survey, interviewer.idep,(data)=>{resolve2({interviewer: interviewer, state_count: data})})
	              })
	            )
	      })
	      Promise.all(promises).then(data=>{
	        const processedData=[]
	        data.forEach(data=>{
	          const line = {}
	          line.interviewer = data.interviewer.interviewer_first_name + ' ' + data.interviewer.interviewer_last_name
	          formatForMonitoringTable(line, data.state_count)
	          processedData.push(line)
	        })
	        resolve(processedData)
	      })
	    })
	  });

	  const p2 = new Promise((resolve, reject) => {
	    Service.getStateCount(survey, (data)=>{
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


	static getDataForCampaignPortal(campaignId, cb){
		const p1 = new Promise((resolve, reject) => {Service.getInterviewersByCampaign(campaignId, 
		  (data)=>{resolve(data);});
		});
		const p2 = new Promise((resolve, reject) => {Service.getNotAttributedByCampaign(campaignId, 
		  (data)=>{resolve(data);});
		});
		const p3 = new Promise((resolve, reject) => {Service.getTotalDemByCampaign(campaignId, 
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
  line.notStarted = stateCount.ANS_count
  line.onGoing = calculateOngoing(stateCount)
  line.waitingForIntValidation = stateCount.WFT_count + stateCount.WFS_count
  line.intValidated = stateCount.TBR_count
  line.demValidated = stateCount.FIN_count
  line.preparingContact = stateCount.PRC_count
  line.atLeastOneContact = stateCount.AOC_count
  line.appointmentTaken = stateCount.APS_count
  line.interviewStarted = stateCount.INS_count
}

function calculateCompletionRate(data){
  return (data.total - data.INI_count - data.ANS_count)/data.total
}

function calculateOngoing(data){
  return data.PRC_count + data.AOC_count + data.APS_count + data.INS_count + data.WFT_count + data.WFS_count
}



export default DataFormatter;
