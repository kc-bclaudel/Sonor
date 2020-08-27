const baseUrl = `${window.localStorage.getItem('PEARL_JAM_URL')}`;

class Service {
  constructor(token) {
    if (token) {
      this.options = {
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }),
      };
    }
  }

  putSurveyUnitToValidate(su, cb) {
    const options = {};
    Object.assign(options, this.options);
    options.method = 'PUT';
    fetch(`${baseUrl}/api/survey-unit/${su}/state/FIN`, options)
      .then((res) => cb(res))
      .catch(console.log);
  }

  putPreferences(preferences, cb) {
    const options = {};
    Object.assign(options, this.options);
    options.method = 'PUT';
    options.body = JSON.stringify(preferences);
    fetch(`${baseUrl}/api/preferences`, options)
      .then((res) => cb(res))
      .catch(console.log);
  }

  getUser(cb) {
    return new Promise((resolve) => {
      fetch(`${baseUrl}/api/user`, this.options)
        .then((res) => res.json())
        .then((data) => {
          if (cb) { cb(data); }
          resolve(data);
        })
        .catch(console.log);
    });
  }

  getSurveys(cb) {
    fetch(`${baseUrl}/api/campaigns`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  // getInterviewersByCampaign(campaignId, cb) {
  //   fetch(`${baseUrl}/api/campaign/${campaignId}/interviewers`, this.options)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       cb(data);
  //     })
  //     .catch(console.log);
  // }

  getNotAttributedByCampaign(campaignId, cb) {
    fetch(`${baseUrl}/api/campaign/${campaignId}/survey-units/not-attributed`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getAbandonedByCampaign(campaignId, cb) {
    fetch(`${baseUrl}/api/campaign/${campaignId}/survey-units/abandoned`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      // .catch((err) => {
      //   console.log(err);
      //   // To be able to access campaign portal while API is unavailable (to remove after dev)
      //   cb({ count: null });
      // });
  }

  getTerminatedByCampaign(campaignId, cb) {
    fetch(`${baseUrl}/api/campaign/${campaignId}/survey-units?state=FIN`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getStatesBySurveyId(surveyId, cb) {
    fetch(`${baseUrl}/api/survey-unit/${surveyId}/states`, this.options)
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

  getSurveyUnits(campaignId, state, cb) {
    fetch(`${baseUrl}/api/campaign/${campaignId}/survey-units${state ? `?state=${state}` : ''}`, this.options)
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
