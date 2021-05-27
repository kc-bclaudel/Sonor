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

  // -------------------------- //
  // Survey-Units service begin //
  // -------------------------- //
  getSurveyUnits(campaignId, state, cb) {
    return new Promise((resolve) => {
      fetch(`${baseUrlPearlJam}/api/campaign/${campaignId}/survey-units?${state ? `state=${state}` : ''}`, this.makeOptions())
        .then((res) => res.json())
        .then((data) => {
          if (cb) {
            cb(data);
          }
          resolve(data);
        })
        .catch((e) => {
          console.log(e);
          NotificationManager.error(`${D.cannotRetreiveData} ${D.verifyInternetCo}`, D.error, 10000);
        });
    });
  }

  getSurveyUnitsClosable(cb) {
    fetch(`${baseUrlPearlJam}/api/survey-units/closable`, this.makeOptions())
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch((e) => {
        console.log(e);
        NotificationManager.error(`${D.cannotRetreiveData} ${D.verifyInternetCo}`, D.error, 10000);
      });
  }

  getSurveyUnitsNotAttributedByCampaign(campaignId, cb) {
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

  getSurveyUnitsAbandonedByCampaign(campaignId, cb) {
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

  getStatesBySurveyUnit(su, cb) {
    fetch(`${baseUrlPearlJam}/api/survey-unit/${su}/states`, this.makeOptions())
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch((e) => {
        console.log(e);
        NotificationManager.error(`${D.cannotRetreiveData} ${D.verifyInternetCo}`, D.error, 10000);
      });
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

  putSurveyUnitStateToChange(su, state, cb) {
    const options = {};
    Object.assign(options, this.makeOptions());
    options.method = 'PUT';
    fetch(`${baseUrlPearlJam}/api/survey-unit/${su}/state/${state}`, options)
      .then((res) => cb(res))
      .catch((e) => {
        console.log(e);
        cb();
      });
  }

  putSurveyUnitClose(su, closingCause, cb) {
    const options = {};
    Object.assign(options, this.makeOptions());
    options.method = 'PUT';
    fetch(`${baseUrlPearlJam}/api/survey-unit/${su}/close/${closingCause}`, options)
      .then((res) => cb(res))
      .catch((e) => {
        console.log(e);
        cb();
      });
  }

  putSurveyUnitClosingCause(su, closingCause, cb) {
    const options = {};
    Object.assign(options, this.makeOptions());
    options.method = 'PUT';
    fetch(`${baseUrlPearlJam}/api/survey-unit/${su}/closing-cause/${closingCause}`, options)
      .then((res) => cb(res))
      .catch((e) => {
        console.log(e);
        cb();
      });
  }

  putSurveyUnitComment(su, comment, cb) {
    const options = {};
    Object.assign(options, this.makeOptions());
    options.method = 'PUT';
    options.body = JSON.stringify(comment);
    fetch(`${baseUrlPearlJam}/api/survey-unit/${su}/comment`, options)
      .then((res) => cb(res))
      .catch((e) => {
        console.log(e);
        cb();
      });
  }

  putSurveyUnitViewed(su, cb) {
    const options = {};
    Object.assign(options, this.makeOptions());
    options.method = 'PUT';
    fetch(`${baseUrlPearlJam}/api/survey-unit/${su}/viewed`, options)
      .then((res) => cb(res))
      .catch((e) => {
        console.log(e);
        cb();
      });
  }
  // ------------------------- //
  // Survey-Units service end //
  // ------------------------- //

  // -------------------------- //
  // Preferences service begin //
  // -------------------------- //
  putPreferences(preferences, cb) {
    const options = {};
    Object.assign(options, this.makeOptions());
    options.method = 'PUT';
    options.body = JSON.stringify(preferences);
    fetch(`${baseUrlPearlJam}/api/preferences`, options)
      .then((res) => cb(res))
      .catch(console.log);
  }
  // ------------------------ //
  // Preferences service end //
  // ------------------------ //

  // -------------------- //
  // Users service begin //
  // -------------------- //
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
  // ------------------ //
  // Users service end //
  // ------------------ //

  // ----------------------- //
  // Campaigns service begin //
  // ----------------------- //
  getCampaigns(cb) {
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

  getCampaignsByInterviewer(idep, cb) {
    return new Promise((resolve) => {
      fetch(`${baseUrlPearlJam}/api/interviewer/${idep}/campaigns`, this.makeOptions())
        .then((res) => res.json())
        .then((data) => {
          if (cb) {
            cb(data);
          }
          resolve(data);
        })
        .catch((e) => {
          console.log(e);
          if (cb) {
            cb([]);
          }
          resolve([]);
        });
    });
  }
  // --------------------- //
  // Campaigns service end //
  // --------------------- //

  // -------------------------- //
  // State counts service begin //
  // -------------------------- //
  getStateCount(campaignId, date, cb) {
    return new Promise((resolve) => {
      fetch(`${baseUrlPearlJam}/api/campaign/${campaignId}/survey-units/state-count?date=${date}`, this.makeOptions())
        .then((res) => res.json())
        .then((data) => {
          if (cb) {
            cb(data);
          }
          resolve(data);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  getStateCountNotAttributed(campaignId, date, cb) {
    return new Promise((resolve) => {
      fetch(`${baseUrlPearlJam}/api/campaign/${campaignId}/survey-units/not-attributed/state-count?date=${date}`, this.makeOptions())
        .then((res) => res.json())
        .then((data) => {
          if (cb) {
            cb(data);
          }
          resolve(data);
        })
        .catch((e) => {
          console.log(e);
          if (cb) {
            cb(null);
          }
          resolve(null);
        });
    });
  }

  getStateCountByInterviewer(campaignId, idep, date, cb) {
    return new Promise((resolve) => {
      fetch(`${baseUrlPearlJam}/api/campaign/${campaignId}/survey-units/interviewer/${idep}/state-count?date=${date}`, this.makeOptions())
        .then((res) => res.json())
        .then((data) => {
          if (cb) {
            cb(data);
          }
          resolve(data);
        })
        .catch((e) => {
          console.log(e);
          if (cb) {
            cb(null);
          }
          resolve(null);
        });
    });
  }

  getStateCountByCampaign(date, cb) {
    return new Promise((resolve) => {
      fetch(`${baseUrlPearlJam}/api/campaigns/survey-units/state-count?date=${date}`, this.makeOptions())
        .then((res) => res.json())
        .then((data) => {
          if (cb) {
            cb(data);
          }
          resolve(data);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  getStateCountTotalByCampaign(campaignId, cb) {
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
  // ------------------------ //
  // State count service end //
  // ------------------------ //

  // ------------------------------- //
  // Contact outcomes service begin //
  // ------------------------------- //
  getContactOutcomes(campaignId, date, cb) {
    return new Promise((resolve) => {
      fetch(`${baseUrlPearlJam}/api/campaign/${campaignId}/survey-units/contact-outcomes?date=${date}`, this.makeOptions())
        .then((res) => res.json())
        .then((data) => {
          if (cb) {
            cb(data);
          }
          resolve(data);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  getContactOutcomesNotAttributed(campaignId, date, cb) {
    return new Promise((resolve) => {
      fetch(`${baseUrlPearlJam}/api/campaign/${campaignId}/survey-units/not-attributed/contact-outcomes?date=${date}`, this.makeOptions())
        .then((res) => res.json())
        .then((data) => {
          if (cb) {
            cb(data);
          }
          resolve(data);
        })
        .catch((e) => {
          console.log(e);
          if (cb) {
            cb(null);
          }
          resolve(null);
        });
    });
  }

  getContactOutcomesByInterviewer(campaignId, idep, date, cb) {
    return new Promise((resolve) => {
      fetch(`${baseUrlPearlJam}/api/campaign/${campaignId}/survey-units/interviewer/${idep}/contact-outcomes?date=${date}`, this.makeOptions())
        .then((res) => res.json())
        .then((data) => {
          if (cb) {
            cb(data);
          }
          resolve(data);
        })
        .catch((e) => {
          console.log(e);
          if (cb) {
            cb(null);
          }
          resolve(null);
        });
    });
  }

  getContactOutcomesByCampaign(date, cb) {
    return new Promise((resolve) => {
      fetch(`${baseUrlPearlJam}/api/campaigns/survey-units/contact-outcomes?date=${date}`, this.makeOptions())
        .then((res) => res.json())
        .then((data) => {
          if (cb) {
            cb(data);
          }
          resolve(data);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }
  // ---------------------------- //
  // Contact outcomes service end //
  // ---------------------------- //

  // ---------------------------- //
  // Closing causes service start //
  // ---------------------------- //
  getClosingCausesByInterviewer(campaignId, idep, date, cb) {
    return new Promise((resolve) => {
      fetch(`${baseUrlPearlJam}/api/campaign/${campaignId}/survey-units/interviewer/${idep}/closing-causes?date=${date}`, this.makeOptions())
        .then((res) => res.json())
        .then((data) => {
          if (cb) {
            cb(data);
          }
          resolve(data);
        })
        .catch((e) => {
          console.log(e);
          if (cb) {
            cb(null);
          }
          resolve(null);
        });
    });
  }
  // ----------------------------- //
  // Closing causes service end //
  // ----------------------------- //

  // --------------------------- //
  // Interviewers service begin //
  // --------------------------- //
  getInterviewers(cb) {
    fetch(`${baseUrlPearlJam}/api/interviewers`, this.makeOptions())
      .then((res) => res.json())
      .then((data) => {
        cb(data);
      })
      .catch((e) => {
        console.log(e);
        cb([]);
      });
  }

  getInterviewersByCampaign(campaignId, cb) {
    return new Promise((resolve) => {
      fetch(`${baseUrlPearlJam}/api/campaign/${campaignId}/interviewers`, this.makeOptions())
        .then((res) => res.json())
        .then((data) => {
          if (cb) {
            cb(data);
          }
          resolve(data);
        })
        .catch(console.log);
    });
  }
  // ------------------------- //
  // Interviewers service end //
  // ------------------------- //

  // ----------------------------- //
  // Questionnaires service begin //
  // ----------------------------- //
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
  // --------------------------- //
  // Questionnaires service end //
  // --------------------------- //

  // ---------------------------- //
  // Notifications service begin //
  // ---------------------------- //
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
  // -------------------------- //
  // Notifications service end //
  // -------------------------- //
}

export default Service;
