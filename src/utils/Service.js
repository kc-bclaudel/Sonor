import { NotificationManager } from 'react-notifications';
import D from '../i18n';

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
    } else {
      this.options = {
        headers: new Headers({
          'Content-Type': 'application/json',
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
        .catch((e) => {
          if (cb) {
            cb({ error: true, message: e });
          }
          resolve({ error: true, message: e });
          NotificationManager.error(`${D.cannotRetreiveData} ${D.verifyInternetCo}`, D.error, 10000);
        });
    });
  }

  getSurveys(cb) {
    fetch(`${baseUrl}/api/campaigns`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch((e) => {
        console.log(e);
        NotificationManager.error(`${D.cannotRetreiveData} ${D.verifyInternetCo}`, D.error, 10000);
      });
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
      .catch((err) => {
        console.log(err);
      });
  }

  getAbandonedByCampaign(campaignId, cb) {
    fetch(`${baseUrl}/api/campaign/${campaignId}/survey-units/abandoned`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getTerminatedByCampaign(campaignId, cb) {
    fetch(`${baseUrl}/api/campaign/${campaignId}/survey-units?state=FIN`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch((e) => {
        console.log(e);
        NotificationManager.error(`${D.cannotRetreiveData} ${D.verifyInternetCo}`, D.error, 10000);
      });
  }

  getStatesBySurveyId(surveyId, cb) {
    fetch(`${baseUrl}/api/survey-unit/${surveyId}/states`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch((e) => {
        console.log(e);
        NotificationManager.error(`${D.cannotRetreiveData} ${D.verifyInternetCo}`, D.error, 10000);
      });
  }

  getTotalDemByCampaign(campaignId, cb) {
    fetch(`${baseUrl}/api/campaign/${campaignId}/survey-units/state-count`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch((e) => {
        console.log(e);
        NotificationManager.error(`${D.cannotRetreiveData} ${D.verifyInternetCo}`, D.error, 10000);
      });
  }

  getSurveyUnits(campaignId, state, cb) {
    fetch(`${baseUrl}/api/campaign/${campaignId}/survey-units${state ? `?state=${state}` : ''}`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch((e) => {
        console.log(e);
        NotificationManager.error(`${D.cannotRetreiveData} ${D.verifyInternetCo}`, D.error, 10000);
      });
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
      .catch((e) => {
        console.log(e);
        cb(null);
      });
  }

  getStateCount(campaignId, date, cb) {
    fetch(`${baseUrl}/api/campaign/${campaignId}/survey-units/state-count?date=${date}`, this.options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }
}

export default Service;
