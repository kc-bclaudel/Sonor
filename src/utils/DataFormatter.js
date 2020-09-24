import Service from './Service';
import Utils from './Utils';
import {
  BY_INTERVIEWER_ONE_SURVEY,
  BY_SURVEY,
  BY_SITE,
} from './constants.json';

class DataFormatter {
  constructor(keycloak) {
    this.service = new Service(keycloak);
  }

  getUserInfo(cb) {
    this.service.getUser((data) => {
      cb(data);
    });
  }

  getPreferences(cb) {
    return new Promise((resolve) => {
      this.service.getSurveys((data) => {
        const formattedData = data
          .filter((survey) => Utils.isVisible(survey))
          .reduce((acc, survey) => {
            acc[survey.id] = {
              label: survey.label,
              preference: survey.preference,
            };
            return acc;
          }, {});
        if (cb) {
          cb(formattedData);
        }
        resolve(formattedData);
      });
    });
  }

  getDataForMainScreen(date, cb) {
    return new Promise((resolve) => {
      this.service.getSurveys((data) => {
        const formattedData = data
          .filter((survey) => Utils.isVisible(survey, date))
          .map((survey) => {
            const formattedSurvey = {};
            Object.assign(formattedSurvey, survey);
            formattedSurvey.phase = Utils.getCampaignPhase(
              survey.collectionStartDate,
              survey.collectionEndDate,
              survey.treatmentEndDate,
            );
            return formattedSurvey;
          });
        if (cb) {
          cb(formattedData);
        }
        resolve(formattedData);
      });
    });
  }

  getDataForListSU(surveyId, cb) {
    const p1 = new Promise((resolve) => {
      this.service.getUser((res) => {
        resolve(res.organizationUnit.label);
      });
    });
    const p2 = new Promise((resolve) => {
      this.service.getSurveyUnits(surveyId, null, (res) => {
        const processedData = res.map((su) => ({
          id: su.id,
          ssech: su.ssech,
          departement: su.location,
          city: su.city,
          interviewer: `${su.interviewer.interviewerLastName} ${su.interviewer.interviewerFirstName}`,
          idep: su.interviewer.id,
        }));
        resolve(processedData);
      });
    });
    Promise.all([p1, p2]).then((data) => {
      cb({ site: data[0], surveyUnits: data[1] });
    });
  }

  getDataForReview(surveyId, cb) {
    this.getListSUToReview(surveyId).then((data) => {
      cb(data);
    });
  }

  finalizeSurveyUnits(suToFinalize, cb) {
    return new Promise((resolve) => {
      const promises = suToFinalize.map((su) => (
        new Promise((resolve2) => {
          this.service.putSurveyUnitToValidate(su, (data) => {
            resolve2(data);
          });
        })
      ));

      Promise.all(promises).then((data) => {
        if (cb) {
          cb(data);
        }
        resolve(data);
      });
    });
  }

  updatePreferences(preferences, cb) {
    return new Promise((resolve) => {
      this.service.putPreferences(preferences, (data) => {
        if (cb) { cb(data); }
        resolve(data);
      });
    });
  }

  getListSuTerminated(campaignId, cb) {
    return new Promise((resolve) => {
      let processedData = [];
      this.service.getQuestionnaireId(campaignId, (queenRes) => {
        this.service.getTerminatedByCampaign(campaignId, (data) => {
          processedData = data.map((intData) => {
            const line = {};
            Object.assign(line, intData);
            line.interviewerFirstName = intData.interviewer.interviewerFirstName;
            line.interviewerLastName = intData.interviewer.interviewerLastName;
            if (queenRes) {
              line.questionnaireId = queenRes.questionnaireId;
            }
            return line;
          });
          if (cb) { cb(processedData); }
          resolve(processedData);
        });
      });
    });
  }

  getStatesSurvey(surveyId, cb) {
    return new Promise((resolve) => {
      this.service.getStatesBySurveyId(surveyId, (data) => {
        if (cb) { cb(data.states); }
        resolve(data.states);
      });
    });
  }

  getListSUToReview(surveyId) {
    return new Promise((resolve) => {
      this.service.getSurveys((res) => {
        const promises = res.filter((campaign) => (surveyId === null || campaign.id === surveyId))
          .map((campaign) => (
            new Promise((resolve2) => {
              this.service.getQuestionnaireId(campaign.id, (queenRes) => {
                this.service.getSurveyUnits(campaign.id, 'TBR', (res2) => {
                  const lstSU = res2.map((su) => ({
                    campaignLabel: campaign.label,
                    questionnaireId: queenRes ? queenRes.questionnaireId : null,
                    interviewer: `${su.interviewer.interviewerLastName} ${su.interviewer.interviewerFirstName}`,
                    idep: su.interviewer.id,
                    id: su.id,
                  }))
                    .sort((a, b) => (a.interviewer > b.interviewer ? 1 : -1));
                  resolve2(lstSU);
                });
              });
            })
          ));
        Promise.all(promises).then((data) => {
          resolve(data.flat());
        });
      });
    });
  }

  getlinesDetails(survey, interviewers, date) {
    return new Promise((resolve) => {
      const promises = interviewers.map((interv) => (
        new Promise((resolve2) => {
          this.service.getInterviewersStateCount(
            survey.id,
            interv.id,
            date,
            (data) => {
              const interviewer = {};
              Object.assign(interviewer, interv);
              interviewer.survey = survey.id;
              resolve2({ interviewer, stateCount: data });
            },
          );
        })
      ));
      Promise.all(promises).then((data) => {
        const processedData = data.map((intData) => {
          const line = {};
          Object.assign(line, intData);
          line.interviewerFirstName = intData.interviewer.interviewerFirstName;
          line.interviewerLastName = intData.interviewer.interviewerLastName;
          line.interviewerId = intData.interviewer.id;
          return line;
        });
        resolve(processedData);
      });
    });
  }

  async getDataForMonitoringTable(survey, givenDate, pagination, mode, cb) {
    // Adding 24h to take all states added before the next day into account
    const date = givenDate + 86400000;
    const interviewers = [];
    const getDataForSingleSurvey = !Array.isArray(survey);
    let p1;
    let site;

    if (mode !== BY_SITE) {
      let surveysToGetInterviewersFrom;
      if (getDataForSingleSurvey) {
        surveysToGetInterviewersFrom = [survey];
      } else {
        surveysToGetInterviewersFrom = await this.getDataForMainScreen(date);
      }
      site = (await this.service.getUser()).organizationUnit.label;
      p1 = new Promise((resolve) => {
        if (mode === BY_INTERVIEWER_ONE_SURVEY) {
          const promises = surveysToGetInterviewersFrom.map((surv) => (
            new Promise((resolve2) => {
              this.service.getInterviewers(surv.id, (res) => {
                res.forEach((interviewer) => {
                  Utils.addIfNotAlreadyPresent(interviewers, interviewer);
                });
                this.getlinesDetails(
                  surv,
                  res,
                  date,
                ).then((data) => resolve2(data));
              });
            })
          ));
          Promise.all(promises).then((data) => {
            resolve(Utils.sumOn(data.flat(), 'interviewerId'));
          });
        } else if (mode === BY_SURVEY) {
          this.service.getStateCountByCampaign(date, (res) => {
            resolve(res.map((x) => {
              const obj = Utils.formatForMonitoringTable(x);
              obj.survey = x.campaign.label;
              return obj;
            }));
          });
        } else {
          this.service.getStateCountByInterviewer(date, (res) => {
            resolve(res.map((x) => {
              const obj = Utils.formatForMonitoringTable(x);
              obj.interviewerFirstName = x.interviewer.interviewerFirstName;
              obj.interviewerLastName = x.interviewer.interviewerLastName;
              obj.interviewerId = x.interviewer.id;
              return obj;
            }));
          });
        }
      });
    }

    if (mode === BY_INTERVIEWER_ONE_SURVEY || mode === BY_SITE) {
      const p2 = new Promise((resolve) => {
        this.service.getStateCount(survey.id, date, (data) => {
          if (mode === BY_INTERVIEWER_ONE_SURVEY) {
            this.service.getUser((userInfo) => {
              const userOUs = userInfo.localOrganizationUnits.map((x) => x.id);
              const demStateCounts = data.organizationUnits
                .filter((dem) => userOUs.includes(dem.idDem))
                .map((dem) => ({ stateCount: dem }));
              const totalDem = Utils.getStateCountSum(demStateCounts);
              const totalFrance = Utils.formatForMonitoringTable(data.france);
              resolve({ dem: totalDem, france: totalFrance });
            });
          }
          if (mode === BY_SITE) {
            const demDatas = data.organizationUnits
              .filter((dem) => dem.total != null)
              .map((dem) => {
                const demToPush = Utils.formatForMonitoringTable(dem);
                demToPush.site = dem.labelDem;
                return demToPush;
              });
            const totalFrance = Utils.formatForMonitoringTable(data.france);
            resolve({ dem: demDatas, france: totalFrance });
          }
        });
      });
      if (mode === BY_INTERVIEWER_ONE_SURVEY) {
        Promise.all([p1, p2]).then((data) => {
          cb({
            interviewers,
            site,
            linesDetails: data[0],
            total: data[1],
            relevantInterviewers: interviewers,
          });
        });
      }
      if (mode === BY_SITE) {
        p2.then((data) => {
          cb({
            linesDetails: data.dem,
            total: data,
          });
        });
      }
    } else {
      p1.then((data) => {
        cb({
          site,
          linesDetails: data,
        });
      });
    }
  }

  getDataForCampaignPortal(campaignId, cb) {
    const p1 = new Promise((resolve) => {
      this.service.getInterviewers(campaignId, (data) => {
        resolve(data);
      });
    });
    const p2 = new Promise((resolve) => {
      this.service.getNotAttributedByCampaign(campaignId, (data) => {
        resolve(data);
      });
    });
    const p3 = new Promise((resolve) => {
      this.service.getAbandonedByCampaign(campaignId, (data) => {
        resolve(data);
      });
    });
    const p4 = new Promise((resolve) => {
      this.service.getTotalDemByCampaign(campaignId, (data) => {
        this.service.getUser((userInfo) => {
          const userOUs = userInfo.localOrganizationUnits.map((x) => x.id);
          const demStateCounts = data.organizationUnits
            .filter((dem) => userOUs.includes(dem.idDem))
            .map((dem) => ({ stateCount: dem }));
          const totalDem = Utils.getStateCountSum(demStateCounts);
          resolve(totalDem);
        });
      });
    });
    const p5 = new Promise((resolve) => {
      this.service.getUser((res) => {
        resolve(res.organizationUnit.label);
      });
    });
    Promise.all([p1, p2, p3, p4, p5]).then((data) => {
      cb({
        interviewers: data[0],
        notAttributed: data[1],
        abandoned: data[2],
        total: data[3],
        site: data[4],
      });
    });
  }
}

export default DataFormatter;
