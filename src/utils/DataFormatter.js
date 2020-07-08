import Service from './Service';
import Utils from './Utils';

class DataFormatter {
  constructor(token) {
    this.service = new Service(token);
  }

  getDataForMainScreen(cb) {
    this.service.getSurveys((data) => {
      const formattedData = [];
      data.forEach((survey) => {
        const formattedSurvey = {};
        Object.assign(formattedSurvey, survey);
        formattedSurvey.phase = Utils.getCampaignPhase(
          survey.collectionStartDate, survey.collectionEndDate, survey.treatmentEndDate,
        );
        formattedSurvey.collectionStartDate = Utils.convertToDateString(survey.collectionStartDate);
        formattedSurvey.collectionEndDate = Utils.convertToDateString(survey.collectionEndDate);
        formattedSurvey.treatmentEndDate = Utils.convertToDateString(survey.treatmentEndDate);
        formattedData.push(formattedSurvey);
      });
      cb(formattedData);
    });
  }

  getDataForListSU(survey, cb) {
    this.service.getSurveyUnits(survey, (res) => {
      const processedData = [];
      res.forEach((su) => {
        const suLine = {};
        suLine.id = su.id;
        suLine.ssech = su.ssech;
        suLine.departement = su.location;
        suLine.city = su.city;
        suLine.interviewer = `${su.interviewer.firstName} ${su.interviewer.lastName}`;
        suLine.idep = su.interviewer.id;
        processedData.push(suLine);
      });
      cb(processedData);
    });
  }

  getInterviewersDetail(survey, interviewers, date, pagination) {
    return new Promise((resolve) => {
      const promises = [];
      for (let i = (pagination.page - 1) * pagination.size;
        i < pagination.page * pagination.size && i < interviewers.length;
        i += 1
      ) {
        promises.push(
          new Promise((resolve2) => {
            this.service.getInterviewersStateCount(survey, interviewers[i].id, date, (data) => {
              resolve2({ interviewer: interviewers[i], stateCount: data });
            });
          }),
        );
      }

      Promise.all(promises).then((data) => {
        const processedData = [];
        data.forEach((intData) => {
          const line = Utils.formatForMonitoringTable(intData.stateCount);
          line.interviewer = `${intData.interviewer.interviewerFirstName} ${intData.interviewer.interviewerLastName}`;
          processedData.push(line);
        });
        resolve(processedData);
      });
    });
  }

  getDataForMonitoringTable(survey, date, pagination, cb) {
    let interviewers;
    const p1 = new Promise((resolve) => {
      this.service.getInterviewers(survey, (res) => {
        interviewers = res;
        this.getInterviewersDetail(survey, res, date, pagination).then((data) => resolve(data));
      });
    });

    const p2 = new Promise((resolve) => {
      this.service.getStateCount(survey, date, (data) => {
        const totalDem = Utils.formatForMonitoringTable(data.DEM);
        const totalFrance = Utils.formatForMonitoringTable(data.France);
        resolve({ dem: totalDem, france: totalFrance });
      });
    });

    Promise.all([p1, p2]).then((data) => {
      cb({
        interviewers,
        interviewersDetail: data[0],
        total: data[1],
        relevantInterviewers: interviewers,
      });
    });
  }

  getDataForCampaignPortal(campaignId, cb) {
    const p1 = new Promise((resolve) => {
      this.service.getInterviewersByCampaign(campaignId,
        (data) => { resolve(data); });
    });
    const p2 = new Promise((resolve) => {
      this.service.getNotAttributedByCampaign(campaignId,
        (data) => { resolve(data); });
    });
    const p3 = new Promise((resolve) => {
      this.service.getTotalDemByCampaign(campaignId,
        (data) => { resolve(data); });
    });
    Promise.all([p1, p2, p3]).then((data) => {
      cb({ interviewers: data[0], notAttributed: data[1], total: data[2] });
    });
  }
}

export default DataFormatter;
