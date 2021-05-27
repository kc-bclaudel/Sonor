import Service from './Service';
import Utils from './Utils';
import {
  BY_INTERVIEWER_ONE_SURVEY,
  BY_SURVEY,
  BY_SITE,
  BY_SURVEY_ONE_INTERVIEWER,
} from './constants.json';
import D from '../i18n';

class DataFormatter {
  constructor(keycloak) {
    this.service = new Service(keycloak);
  }

  getInterviewers(cb) {
    this.service.getInterviewers((data) => { cb(data); });
  }

  getUserInfo(cb) {
    this.service.getUser((data) => {
      cb(data);
    });
  }

  getPreferences(cb) {
    return new Promise((resolve) => {
      this.service.getCampaigns((data) => {
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

  updatePreferences(preferences, cb) {
    return new Promise((resolve) => {
      this.service.putPreferences(preferences, (data) => {
        if (cb) { cb(data); }
        resolve(data);
      });
    });
  }

  getDataForCampaignPortal(campaignId, cb) {
    const p1 = new Promise((resolve) => {
      this.service.getInterviewersByCampaign(campaignId, (data) => {
        resolve(Utils.sortData(data, 'CPinterviewer', true));
      });
    });
    const p2 = new Promise((resolve) => {
      this.service.getSurveyUnitsNotAttributedByCampaign(campaignId, (data) => {
        resolve(data);
      });
    });
    const p3 = new Promise((resolve) => {
      this.service.getSurveyUnitsAbandonedByCampaign(campaignId, (data) => {
        resolve(data);
      });
    });
    const p4 = new Promise((resolve) => {
      this.service.getStateCountTotalByCampaign(campaignId, (data) => {
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

  getDataForMainScreen(date, cb) {
    return new Promise((resolve) => {
      this.service.getCampaigns((data) => {
        const formattedData = data
          .filter((survey) => Utils.isVisible(survey, date))
          .map((survey) => {
            const formattedSurvey = {};
            Object.assign(formattedSurvey, survey);
            formattedSurvey.phase = Utils.getCampaignPhase(
              survey.collectionStartDate,
              survey.collectionEndDate,
              survey.endDate,
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

  getDataForClosePage(cb) {
    this.service.getSurveyUnitsClosable((data) => {
      cb(data);
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
          interviewer: su.interviewer
            ? `${su.interviewer.interviewerLastName} ${su.interviewer.interviewerFirstName}`
            : D.unaffected,
          idep: su.interviewer
            ? su.interviewer.id
            : '',
          state: su.state,
          closingCause: su.closingCause,
        }));
        resolve(Utils.sortData(processedData, 'id', true));
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

  async getListSuTerminated(campaignId, cb) {
    let processedData = [];
    this.service.getQuestionnaireId(campaignId, (queenRes) => {
      Promise.all([
        this.service.getSurveyUnits(campaignId, 'FIN'),
        this.service.getSurveyUnits(campaignId, 'CLO'),
      ]).then((data) => {
        const flattenData = data.flat();
        processedData = flattenData.map((intData) => {
          const line = {};
          Object.assign(line, intData);
          if (intData.interviewer) {
            line.interviewerFirstName = intData.interviewer.interviewerFirstName;
            line.interviewerLastName = intData.interviewer.interviewerLastName;
          } else {
            line.interviewerFirstName = D.unaffected;
          }
          if (queenRes) {
            line.questionnaireId = queenRes.questionnaireId;
          }
          return line;
        });
        if (cb) { cb(processedData); }
        Utils.sortData(processedData, 'finalizationDate', true);
      });
    });
  }

  getListSUToReview(surveyId) {
    return new Promise((resolve) => {
      this.service.getCampaigns((res) => {
        const promises = res.filter((campaign) => (surveyId === null || campaign.id === surveyId))
          .map((campaign) => (
            new Promise((resolve2) => {
              this.service.getQuestionnaireId(campaign.id, (queenRes) => {
                this.service.getSurveyUnits(campaign.id, 'TBR', (res2) => {
                  const lstSU = res2.map((su) => ({
                    campaignLabel: campaign.label,
                    campaignId: campaign.id,
                    questionnaireId: queenRes ? queenRes.questionnaireId : null,
                    interviewer: su.interviewer
                      ? `${su.interviewer.interviewerLastName} ${su.interviewer.interviewerFirstName}`
                      : D.unaffected,
                    idep: su.interviewer
                      ? su.interviewer.id
                      : '',
                    id: su.id,
                    viewed: su.viewed,
                    comments: su.comments,
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
          this.service.getStateCountByInterviewer(
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

  updateSurveyUnitsState(suToChangeState, state, cb) {
    return new Promise((resolve) => {
      const promises = suToChangeState.map((su) => (
        new Promise((resolve2) => {
          this.service.putSurveyUnitStateToChange(su, state, (data) => {
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

  closeSurveyUnits(suToChangeState, closingCause, cb) {
    return new Promise((resolve) => {
      const promises = suToChangeState.map((su) => (
        new Promise((resolve2) => {
          this.service.putSurveyUnitClose(su, closingCause, (data) => {
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

  tagWithClosingCauseSurveyUnits(suToChangeState, closingCause, cb) {
    return new Promise((resolve) => {
      const promises = suToChangeState.map((su) => (
        new Promise((resolve2) => {
          this.service.putSurveyUnitClosingCause(su, closingCause, (data) => {
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

  updateSurveyUnitsComment(suToChangeComment, comment, cb) {
    return new Promise((resolve) => {
      const body = {
        type: 'MANAGEMENT',
        value: comment,
      };
      this.service.putSurveyUnitComment(suToChangeComment, body, (data) => {
        if (cb) { cb(data); }
        resolve(data);
      });
    });
  }

  updateSurveyUnitViewed(suId, cb) {
    return new Promise((resolve) => {
      this.service.putSurveyUnitViewed(suId, (data) => {
        if (cb) {
          cb(data);
        }
        resolve(data);
      });
    });
  }

  getStatesSurvey(surveyId, cb) {
    return new Promise((resolve) => {
      this.service.getStatesBySurveyUnit(surveyId, (data) => {
        if (cb) { cb(data.states); }
        resolve(Utils.sortData(data.states, 'date', true));
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

    if (mode === BY_SURVEY_ONE_INTERVIEWER) {
      this.getSurveyByInterviewerDataForMonitoringTable(survey, date, (data) => {
        cb(data);
      });
    } else {
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
                this.service.getInterviewersByCampaign(surv.id, (res) => {
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
                .filter((dem) => dem.total)
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
  }

  async getSurveyByInterviewerDataForMonitoringTable(interviewer, date, cb) {
    this.service.getCampaignsByInterviewer(interviewer.id)
      .then((campaigns) => {
        const stateCountProms = campaigns.map((c) => this.service.getStateCountByInterviewer(
          c.id,
          interviewer.id,
          date,
        ));
        Promise.all(stateCountProms)
          .then((stateCounts) => {
            cb(
              {
                linesDetails: stateCounts
                  .filter((line) => line.total)
                  .map((x, index) => {
                    const obj = Utils.formatForMonitoringTable(x);
                    obj.survey = campaigns[index].label;
                    return obj;
                  }),
              },
            );
          });
      });
  }

  async getDataForCollectionTable(chosenElm, givenDate, pagination, mode, cb) {
    // Adding 24h to take all states added before the next day into account
    const date = givenDate + 86400000;

    switch (mode) {
      case BY_SURVEY:
        this.getDataForCollectionTableBySurvey(date, (data) => {
          cb(data);
        });
        break;
      case BY_INTERVIEWER_ONE_SURVEY:
        this.getDataForCollectionTableByInterviewerOneSuvey(chosenElm, date, (data) => {
          cb(data);
        });
        break;
      case BY_SURVEY_ONE_INTERVIEWER:
        this.getDataForCollectionTableBySurveyOneInterviewer(chosenElm, date, (data) => {
          cb(data);
        });
        break;
      case BY_SITE:
        this.getDataForCollectionTableBySite(chosenElm, date, (data) => {
          cb(data);
        });
        break;
      default:
        cb();
    }
  }

  async getDataForCollectionTableBySite(survey, date, cb) {
    Promise.all([
      this.service.getContactOutcomes(survey.id, date),
      this.service.getStateCount(survey.id, date),
    ]).then((data) => {
      const lines = data[1].organizationUnits
        .filter((dem) => dem.total)
        .map((dem) => Utils.formatForCollectionTable(
          {
            idDem: dem.idDem,
            site: dem.labelDem,
            isLocal: dem.isLocal,
          },
          data[0].organizationUnits.find((d) => d.idDem === dem.idDem),
          dem,
        ));

      cb({
        linesDetails: lines,
        total: {
          france: Utils.formatForCollectionTable(
            {},
            data[0].france,
            data[1].france,
          ),
        },
      });
    });
  }

  async getDataForCollectionTableBySurvey(date, cb) {
    Promise.all([
      this.service.getContactOutcomesByCampaign(date),
      this.service.getStateCountByCampaign(date),
      this.service.getUser(),
    ]).then((data) => {
      const lines = data[1]
        .filter((camp) => camp.total)
        .map((camp) => Utils.formatForCollectionTable(
          { survey: camp.campaign.label },
          data[0].find((c) => c.campaign.id === camp.campaign.id),
          camp,
        ));

      cb({
        site: data[2].organizationUnit.label,
        linesDetails: lines,
      });
    });
  }

  async getDataForCollectionTableByInterviewerOneSuvey(survey, date, cb) {
    this.service.getInterviewersByCampaign(survey.id, (interviewers) => {
      const p1 = new Promise((resolve) => {
        const promises = interviewers.map((interviewer) => new Promise((resolve2) => {
          Promise.all([
            interviewer,
            this.service.getContactOutcomesByInterviewer(survey.id, interviewer.id, date),
            this.service.getStateCountByInterviewer(survey.id, interviewer.id, date),
          ]).then(resolve2);
        }));
        Promise.all(promises).then((data) => {
          resolve(data
            .filter((intElm) => intElm[2].total)
            .map((intElm) => Utils.formatForCollectionTable(...intElm)));
        });
      });

      const p2 = new Promise((resolve) => {
        const promises2 = [
          this.service.getUser(),
          this.service.getContactOutcomes(survey.id, date),
          this.service.getStateCount(survey.id, date),
        ];
        Promise.all(promises2).then((data) => {
          const userOUs = data[0].localOrganizationUnits.map((x) => x.id);
          const demContactOutcomes = data[1].organizationUnits
            .filter((dem) => userOUs.includes(dem.idDem));
          const demStateCounts = data[2].organizationUnits
            .filter((dem) => userOUs.includes(dem.idDem));
          const totalDem = Utils.formatForCollectionTable(
            {},
            Utils.sumElms(demContactOutcomes),
            Utils.sumElms(demStateCounts),
          );
          const totalFrance = Utils.formatForCollectionTable(
            {},
            data[1].france,
            data[2].france,
          );
          resolve({
            total: {
              dem: totalDem, france: totalFrance,
            },
            site: data[0].organizationUnit.label,
          });
        });
      });

      const p3 = new Promise((resolve) => {
        const promises = [
          this.service.getContactOutcomesNotAttributed(survey.id, date),
          this.service.getStateCountNotAttributed(survey.id, date),
        ];
        Promise.all(promises).then((data) => {
          resolve(
            Utils.formatForCollectionTable(
              {},
              data[0],
              data[1],
            ),
          );
        });
      });

      Promise.all([p1, p2, p3]).then((data) => {
        cb({
          linesDetails: data[0],
          total: data[1].total,
          site: data[1].site,
          notAttributed: data[2],
        });
      });
    });
  }

  async getDataForCollectionTableBySurveyOneInterviewer(interviewer, date, cb) {
    this.service.getCampaignsByInterviewer(interviewer.id)
      .then((campaigns) => {
        const promises = campaigns.map((c) => new Promise((resolve) => {
          const datas = [
            { survey: c.label },
            this.service.getContactOutcomesByInterviewer(
              c.id,
              interviewer.id,
              date,
            ),
            this.service.getStateCountByInterviewer(
              c.id,
              interviewer.id,
              date,
            ),
          ];
          Promise.all(datas).then(resolve);
        }));
        Promise.all(promises)
          .then((data) => {
            cb(
              {
                linesDetails: data
                  .filter((lineData) => lineData[2].total)
                  .map((lineData) => Utils.formatForCollectionTable(...lineData)),
              },
            );
          });
      });
  }

  async getDataForProvisionalStatusTable(chosenElm, givenDate, pagination, mode, cb) {
    // Adding 24h to take all states added before the next day into account
    const date = givenDate + 86400000;
    switch (mode) {
      case BY_INTERVIEWER_ONE_SURVEY:
        this.getDataForProvisionalStatusTableByInterviewerOneSuvey(chosenElm, date, (data) => {
          console.log(data);
          cb(data);
        });
        break;
      case BY_SURVEY_ONE_INTERVIEWER:
        this.getDataForProvisionalStatusTableBySurveyOneInterviewer(chosenElm, date, (data) => {
          console.log(data);
          cb(data);
        });
        break;
      default:
        cb();
    }
  }

  async getDataForProvisionalStatusTableByInterviewerOneSuvey(survey, date, cb) {
    this.service.getInterviewersByCampaign(survey.id).then((interviewers) => {
      const promises = interviewers.map((interviewer) => new Promise((resolve) => {
        const datas = [
          { interviewer },
          this.service.getClosingCausesByInterviewer(
            survey.id,
            interviewer.id,
            date,
          ),
        ];
        Promise.all(datas).then((data) => {
          resolve(
            Utils.formatForProvisionalStatusTable(
              data[0],
              data[1],
            ),
          );
        });
      }));
      Promise.all(promises).then((data) => {
        cb({
          linesDetails: data
            .filter((lineData) => lineData.allocated)
            .map((lineData) => lineData),
        });
      });
    });
  }

  async getDataForProvisionalStatusTableBySurveyOneInterviewer(interviewer, date, cb) {
    this.service.getCampaignsByInterviewer(interviewer.id)
      .then((campaigns) => {
        const promises = campaigns.map((c) => new Promise((resolve) => {
          const datas = [
            { survey: c.label },
            this.service.getClosingCausesByInterviewer(
              c.id,
              interviewer.id,
              date,
            ),
          ];
          Promise.all(datas).then((data) => {
            resolve(
              Utils.formatForProvisionalStatusTable(
                data[0],
                data[1],
              ),
            );
          });
        }));
        Promise.all(promises).then((data) => {
          cb({
            linesDetails: data
              .filter((lineData) => lineData.total)
              .map((lineData) => lineData),
          });
        });
      });
  }

  postMessage(body, cb) {
    this.service.postMessage(body, (data) => cb(data));
  }

  verifyName(text, cb) {
    this.service.verifyName(text, (data) => cb(data));
  }

  getMessageHistory(cb) {
    this.service.getMessageHistory((data) => cb(data));
  }
}

export default DataFormatter;
