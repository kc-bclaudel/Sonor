import Service from './Service';
import Utils from './Utils';
import {
  BY_INTERVIEWER_ONE_SURVEY,
  BY_SURVEY,
  BY_SITE,
} from './constants.json';

class DataFormatter {
  constructor(token) {
    this.service = new Service(token);
  }

  getUserInfo(cb) {
    this.service.getUser((data) => {
      cb(data);
    });
  }

  getPreferences(cb) {
    return new Promise((resolve) => {
      this.service.getSurveys((data) => {
        const formattedData = {};
        data.forEach((survey) => {
          if (Utils.isVisible(survey)) {
            formattedData[survey.id] = {
              label: survey.label,
              preference: survey.preference,
            };
          }
        });
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
        const formattedData = [];
        data.forEach((survey) => {
          if (Utils.isVisible(survey, date)) {
            const formattedSurvey = {};
            Object.assign(formattedSurvey, survey);
            formattedSurvey.phase = Utils.getCampaignPhase(
              survey.collectionStartDate,
              survey.collectionEndDate,
              survey.treatmentEndDate,
            );
            formattedData.push(formattedSurvey);
          }
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
      this.service.getSurveyUnits(surveyId, (res) => {
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
      this.service.putSurveyUnitsToValidate(suToFinalize, (data) => {
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

  getListSUToReview(surveyId) {
    return new Promise((resolve) => {
      const promises = [];
      this.service.getSurveys((res) => {
        res.forEach((campaign) => {
          if (surveyId === null || campaign.id === surveyId) {
            promises.push(
              new Promise((resolve2) => {
                this.service.getSurveyUnits(campaign.id, (res2) => {
                  const lstSU = [];
                  res2.forEach((su) => {
                    const suLine = {};
                    suLine.campaignLabel = campaign.label;
                    suLine.interviewer = `${su.interviewer.lastName} ${su.interviewer.firstName}`;
                    suLine.idep = su.interviewer.id;
                    suLine.id = su.id;
                    lstSU.push(suLine);
                  });
                  lstSU.sort((a, b) => (a.interviewer > b.interviewer ? 1 : -1));
                  resolve2(lstSU);
                });
              }),
            );
          }
        });
        Promise.all(promises).then((data) => {
          resolve(data.flat());
        });
      });
    });
  }

  getInterviewersDetail(survey, interviewers, date, mode) {
    const surveyId = !survey || survey.id;
    return new Promise((resolve) => {
      const promises = [];
      interviewers.forEach((interv) => {
        promises.push(
          new Promise((resolve2) => {
            this.service.getInterviewersStateCount(
              surveyId || interv.survey,
              interv.id,
              date,
              (data) => {
                const interviewer = {};
                Object.assign(interviewer, interv);
                interviewer.survey = surveyId;
                resolve2({ interviewer, stateCount: data });
              },
            );
          }),
        );
      });
      if (mode === BY_SURVEY) {
        Promise.all(promises).then((data) => {
          const sum = Utils.getStateCountSum(data);
          sum.survey = survey.label;
          resolve(sum);
        });
      } else {
        Promise.all(promises).then((data) => {
          const processedData = [];
          data.forEach((intData) => {
            const line = {};
            Object.assign(line, intData);
            line.interviewerFirstName = intData.interviewer.interviewerFirstName;
            line.interviewerLastName = intData.interviewer.interviewerLastName;
            line.interviewerId = intData.interviewer.id;
            processedData.push(line);
          });
          resolve(processedData);
        });
      }
    });
  }

  async getDataForMonitoringTable(survey, date, pagination, mode, cb) {
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
        const promises = [];
        surveysToGetInterviewersFrom.forEach((surv) => {
          promises.push(
            new Promise((resolve2) => {
              this.service.getInterviewers(survey, (res) => {
                res.forEach((interviewer) => {
                  Utils.addIfNotAlreadyPresent(interviewers, interviewer);
                });
                this.getInterviewersDetail(
                  surv,
                  res,
                  date,
                  mode,
                ).then((data) => resolve2(data));
              });
            })
          );
        });
        Promise.all(promises).then((data) => {
          if (mode === BY_SURVEY) {
            resolve(data);
          } else {
            resolve(Utils.sumOn(data.flat(), 'interviewerId'));
          }
        });
      });
    }

    if (mode === BY_INTERVIEWER_ONE_SURVEY || mode === BY_SITE) {
      const p2 = new Promise((resolve) => {
        this.service.getStateCount(survey, date, (data) => {
          if (mode === BY_INTERVIEWER_ONE_SURVEY) {
            this.service.getUser((userInfo) => {
              const userOUs = userInfo.localOrganizationUnits.map((x) => x.id);
              const demStateCounts = [];
              data.organizationunits.forEach((dem) => {
                if (userOUs.includes(dem.idDem)) {
                  demStateCounts.push({ stateCount: dem });
                }
              });
              const totalDem = Utils.getStateCountSum(demStateCounts);
              const totalFrance = Utils.formatForMonitoringTable(data.France);
              resolve({ dem: totalDem, france: totalFrance });
            });
          }
          if (mode === BY_SITE) {
            const demDatas = [];
            data.organizationunits.forEach((dem) => {
              const demToPush = Utils.formatForMonitoringTable(dem);
              demToPush.site = dem.idDem;
              demDatas.push(demToPush);
            });
            const totalFrance = Utils.formatForMonitoringTable(data.France);
            resolve({ dem: demDatas, france: totalFrance });
          }
        });
      });
      if (mode === BY_INTERVIEWER_ONE_SURVEY) {
        Promise.all([p1, p2]).then((data) => {
          cb({
            interviewers,
            site,
            interviewersDetail: data[0],
            total: data[1],
            relevantInterviewers: interviewers,
          });
        });
      }
      if (mode === BY_SITE) {
        p2.then((data) => {
          cb({
            interviewersDetail: data.dem,
            total: data,
          });
        });
      }
    } else {
      p1.then((data) => {
        cb({
          interviewers,
          site,
          interviewersDetail: data,
          relevantInterviewers: interviewers,
        });
      });
    }
  }

  getDataForCampaignPortal(campaignId, cb) {
    const p1 = new Promise((resolve) => {
      this.service.getInterviewersByCampaign(campaignId, (data) => {
        resolve(data);
      });
    });
    const p2 = new Promise((resolve) => {
      this.service.getNotAttributedByCampaign(campaignId, (data) => {
        resolve(data);
      });
    });
    const p3 = new Promise((resolve) => {
      this.service.getTotalDemByCampaign(campaignId, (data) => {
        this.service.getUser((userInfo) => {
          const userOUs = userInfo.localOrganizationUnits.map((x) => x.id);
          const demStateCounts = [];
          data.organizationunits.forEach((dem) => {
            if (userOUs.includes(dem.idDem)) {
              demStateCounts.push({ stateCount: dem });
            }
          });
          const totalDem = Utils.getStateCountSum(demStateCounts);
          resolve(totalDem);
        });
      });
    });
    const p4 = new Promise((resolve) => {
      this.service.getUser((res) => {
        resolve(res.organizationUnit.label);
      });
    });
    Promise.all([p1, p2, p3, p4]).then((data) => {
      cb({
        interviewers: data[0], notAttributed: data[1], total: data[2], site: data[3],
      });
    });
  }
}

export default DataFormatter;
