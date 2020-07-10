class Service {
  constructor(token) {
    this.options = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getUser(cb) {
    fetch('http://localhost:7777/api/user', this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getSurveys(cb) {
    fetch('http://localhost:7777/api/campaigns', this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getInterviewersByCampaign(campaignId, cb) {
    fetch(`http://localhost:7777/api/campaign/${campaignId}/interviewers`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getNotAttributedByCampaign(campaignId, cb) {
    fetch(`http://localhost:7777/api/campaign/${campaignId}/survey-units/not-attributed`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getTotalDemByCampaign(campaignId, cb) {
    fetch(`http://localhost:7777/api/campaign/${campaignId}/survey-units/state-count`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getSurveyUnits(campaignId, cb) {
    fetch(`http://localhost:7777/api/campaign/${campaignId}/survey-units`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getInterviewers(campaignId, cb) {
    fetch(`http://localhost:7777/api/campaign/${campaignId}/interviewers`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getInterviewersStateCount(campaignId, idep, date, cb) {
    fetch(`http://localhost:7777/api/campaign/${campaignId}/survey-units/interviewer/${idep}/state-count?date=${date}`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getStateCount(campaignId, date, cb) {
    fetch(`http://localhost:7777/api/campaign/${campaignId}/survey-units/state-count?date=${date}`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }
}

export default Service;
