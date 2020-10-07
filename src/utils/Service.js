import { NotificationManager } from 'react-notifications';
import D from '../i18n';

const baseUrlPearlJam = `${window.localStorage.getItem('PEARL_JAM_URL')}`;
const baseUrlQueen = `${window.localStorage.getItem('QUEEN_URL_BACK_END')}`;

class Service {
  constructor(keycloak) {
    this.keycloak = keycloak;
  }

  makeOptions() {
    if (this.keycloak) {
      return {
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.keycloak.token}`,
        }),
      };
    }
    return {
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    };
  }

  putSurveyUnitToValidate(su, cb) {
    const options = {};
    Object.assign(options, this.makeOptions());
    options.method = 'PUT';
    fetch(`${baseUrlPearlJam}/api/survey-unit/${su}/state/FIN`, options)
      .then((res) => cb(res))
      .catch((e) => {
        console.log(e);
        cb();
      });
  }

  putPreferences(preferences, cb) {
    const options = {};
    Object.assign(options, this.makeOptions());
    options.method = 'PUT';
    options.body = JSON.stringify(preferences);
    fetch(`${baseUrlPearlJam}/api/preferences`, options)
      .then((res) => cb(res))
      .catch(console.log);
  }

  getUser(cb) {
    return new Promise((resolve) => {
      fetch(`${baseUrlPearlJam}/api/user`, this.makeOptions())
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
    fetch(`${baseUrlPearlJam}/api/campaigns`, this.makeOptions())
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
    fetch(`${baseUrlPearlJam}/api/campaign/${campaignId}/interviewers`, this.makeOptions())
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getNotAttributedByCampaign(campaignId, cb) {
    fetch(`${baseUrlPearlJam}/api/campaign/${campaignId}/survey-units/not-attributed`, this.makeOptions())
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch((err) => {
        cb({ count: null });
        console.log(err);
      });
  }

  getAbandonedByCampaign(campaignId, cb) {
    fetch(`${baseUrlPearlJam}/api/campaign/${campaignId}/survey-units/abandoned`, this.makeOptions())
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch((err) => {
        cb({ count: null });
        console.log(err);
      });
  }

  getTerminatedByCampaign(campaignId, cb) {
    fetch(`${baseUrlPearlJam}/api/campaign/${campaignId}/survey-units?state=FIN`, this.makeOptions())
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
    fetch(`${baseUrlPearlJam}/api/survey-unit/${surveyId}/states`, this.makeOptions())
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
    fetch(`${baseUrlPearlJam}/api/campaign/${campaignId}/survey-units/state-count`, this.makeOptions())
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
    fetch(`${baseUrlPearlJam}/api/campaign/${campaignId}/survey-units${state ? `?state=${state}` : ''}`, this.makeOptions())
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
    fetch(`${baseUrlPearlJam}/api/campaign/${campaignId}/interviewers`, this.makeOptions())
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch(console.log);
  }

  getInterviewersStateCount(campaignId, idep, date, cb) {
    fetch(`${baseUrlPearlJam}/api/campaign/${campaignId}/survey-units/interviewer/${idep}/state-count?date=${date}`, this.makeOptions())
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
    fetch(`${baseUrlPearlJam}/api/campaign/${campaignId}/survey-units/state-count?date=${date}`, this.makeOptions())
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getStateCountByCampaign(date, cb) {
    fetch(`${baseUrlPearlJam}/api/campaigns/survey-units/state-count?date=${date}`, this.makeOptions())
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getStateCountByInterviewer(date, cb) {
    fetch(`${baseUrlPearlJam}/api/interviewers/survey-units/state-count?date=${date}`, this.makeOptions())
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getQuestionnaireId(campaignId, cb) {
    fetch(`${baseUrlQueen}/api/campaign/${campaignId}/questionnaire-id`, this.makeOptions())
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch((e) => {
        console.log(e);
        cb();
      });
  }

  postMessage(body, cb) {
    const options = {};
    Object.assign(options, this.makeOptions());
    options.method = 'POST';
    options.body = JSON.stringify(body);

    fetch(`${baseUrlPearlJam}/api/message`, options)
      .then((data) => {
        cb(data);
      });
  }

  verifyName(text, cb) {
    const options = {};
    Object.assign(options, this.makeOptions());
    options.method = 'POST';
    options.body = JSON.stringify({ text });

    fetch(`${baseUrlPearlJam}/api/verify-name`, options)
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch((e) => {
        console.log(e);
        cb([]);
      });
  }

  getMessageHistory(cb) {
    fetch(`${baseUrlPearlJam}/api/message-history`, this.makeOptions())
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch((e) => {
        console.log(e);
        cb([]);
      });
  }
}

export default Service;
