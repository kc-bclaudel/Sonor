import { PEARL_JAM_HOST, PEARL_JAM_PORT } from '../config.json';

const baseUrl = `${PEARL_JAM_HOST}:${PEARL_JAM_PORT}`;

class Service {
  constructor(token) {
    if (token) {
      this.options = {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }),
      };
    }
  }

  getUser(cb) {
    fetch(`${baseUrl}/api/user`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getSurveys(cb) {
    fetch(`${baseUrl}/api/campaigns`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getInterviewersByCampaign(campaignId, cb) {
    fetch(`${baseUrl}/api/campaign/${campaignId}/interviewers`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getNotAttributedByCampaign(campaignId, cb) {
    fetch(`${baseUrl}/api/campaign/${campaignId}/survey-units/not-attributed`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getTotalDemByCampaign(campaignId, cb) {
    fetch(`${baseUrl}/api/campaign/${campaignId}/survey-units/state-count`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getSurveyUnits(campaignId, cb) {
    fetch(`${baseUrl}/api/campaign/${campaignId}/survey-units`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getInterviewers(campaignId, cb) {
    fetch(`${baseUrl}/api/campaign/${campaignId}/interviewers`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getInterviewersStateCount(campaignId, idep, date, cb) {
    fetch(`${baseUrl}/api/campaign/${campaignId}/survey-units/interviewer/${idep}/state-count?date=${date}`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getStateCount(campaignId, date, cb) {
    fetch(`${baseUrl}/api/campaign/${campaignId}/survey-units/state-count?date=${date}`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }
}

export default Service;
