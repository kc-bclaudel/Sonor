import D from '../i18n';
import C from './constants.json';

class Utils {

  static convertToDateString(timestamp, locales, options) {
    return new Date(timestamp).toLocaleDateString(locales, options);
  }

  static convertMsToHoursMinutes(millis) {
    const date = new Date(millis);
    /*     if(date.getHours.length === 1){
      return `${"0" + date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}`;
    } */
    return `${("0" + date.getHours()).slice(-2)}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}`;
  }

  static calculateCompletionRate(data) {
    return (data.tbrCount + data.finCount) / data.total;
  }

  static calculateOngoing(data) {
    return data.prcCount
          + data.aocCount
          + data.apsCount
          + data.insCount;
  }

  static calculateCollectionRate(outcomes, stateCount) {
    return outcomes.inaCount / (stateCount.total - stateCount.npaCount);
  }

  static calculateWasteRate(outcomes, stateCount) {
    return (outcomes.refCount
        + outcomes.impCount
        + outcomes.iniCount
        + outcomes.alaCount
        + outcomes.wamCount
        + stateCount.npaCount
        + stateCount.npiCount
        + stateCount.rowCount
    ) / stateCount.total;
  }

  static formatForMonitoringTable(stateCount) {
    const line = {};
    line.completionRate = this.calculateCompletionRate(stateCount);
    line.total = stateCount.total - stateCount.nvmCount - stateCount.nvaCount;
    line.notStarted = stateCount.vicCount;
    line.onGoing = this.calculateOngoing(stateCount);
    line.waitingForIntValidation = stateCount.wftCount;
    line.intValidated = stateCount.tbrCount + stateCount.wfsCount;
    line.demValidated = stateCount.finCount + stateCount.qnaFinCount;
    line.preparingContact = stateCount.prcCount;
    line.atLeastOneContact = stateCount.aocCount;
    line.appointmentTaken = stateCount.apsCount;
    line.interviewStarted = stateCount.insCount;

    line.interviewerFirstName = stateCount.interviewerFirstName;
    line.interviewerFirstName = stateCount.interviewerLastName;
    line.interviewerId = stateCount.interviewerId;

    return line;
  }

  static formatForCollectionTable(initialObject, outcomes, stateCount) {
    const line = initialObject;

    line.collectionRate = this.calculateCollectionRate(outcomes, stateCount);
    line.wasteRate = this.calculateWasteRate(outcomes, stateCount);
    line.outOfScopeRate = outcomes.oosCount / stateCount.total;
    line.surveysAccepted = outcomes.inaCount;
    line.refusal = outcomes.refCount;
    line.unreachable = outcomes.impCount;
    line.otherWastes = outcomes.iniCount + outcomes.alaCount + outcomes.wamCount;
    line.outOfScope = outcomes.oosCount;
    line.totalProcessed = stateCount.tbrCount + stateCount.finCount;
    line.absInterviewer = stateCount.npaCount;
    line.otherReason = stateCount.npiCount + stateCount.rowCount;
    line.totalClosed = stateCount.npaCount + stateCount.npiCount + stateCount.rowCount;
    line.allocated = stateCount.total;

    return line;
  }

  static formatForProvisionalStatusTable(initialObject, closingCauses) {
    const line = {};
    if (initialObject.interviewer) {
      line.interviewerFirstName = initialObject.interviewer.interviewerFirstName;
      line.interviewerLastName = initialObject.interviewer.interviewerLastName;
      line.interviewerId = initialObject.interviewer.id;
    }
    if (initialObject.survey) {
      line.survey = initialObject.survey;
    }
    line.npiCount = closingCauses.npiCount;
    line.npaCount = closingCauses.npaCount;
    line.rowCount = closingCauses.rowCount;
    line.total = closingCauses.npaCount + closingCauses.npiCount + closingCauses.rowCount;
    line.allocated = closingCauses.total;
    return line;
  }

  static getCampaignPhase(collectionStartDate, collectionEndDate, endDate) {
    const now = new Date().getTime();
    if (!collectionStartDate || now < collectionStartDate) {
      return 0;
    }
    if (!collectionEndDate || now < collectionEndDate) {
      return 1;
    }
    if (!endDate || now < endDate) {
      return 2;
    }
    return 3;
  }

  static displayCampaignPhase(campaignPhase) {
    switch (campaignPhase) {
      case 0:
        return D.initialAssignment;
      case 1:
        return D.collectionInProgress;
      case 2:
        return D.collectionOver;
      case 3:
        return D.treatmentOver;
      default:
        return '';
    }
  }

  static getSortFunction(sortOn, desc, mainSort) {
    let mult = 1;
    if (desc) {
      mult = -1;
    }
    let mainSortFunc;
    if (mainSort) {
      mainSortFunc = Utils.getSortFunction(mainSort);
    }

    const labelsSimpleSort = [
      'city', 'departement', 'ssech', 'campaignLabel', 'interviewer', 'campaign',
      'label', 'id', 'survey', 'site', 'date', 'finalizationDate', 'state',
    ];
    if (labelsSimpleSort.includes(sortOn)) {
      return (a, b) => {
        if (a[sortOn] < b[sortOn]) {
          return -1 * mult;
        }
        if (a[sortOn] !== b[sortOn]) {
          return 1 * mult;
        }
        return mainSort ? mainSortFunc(a, b) : 0;
      };
    }
    if (sortOn === 'CPinterviewer') {
      return (a, b) => {
        const aString = (a.interviewerLastName + a.interviewerFirstName);
        const bString = (b.interviewerLastName + b.interviewerFirstName);
        if (aString < bString) {
          return -1 * mult;
        }
        if (aString !== bString) {
          return 1 * mult;
        }
        return mainSort ? mainSortFunc(a, b) : 0;
      };
    }
    if (['interviewer_terminated', 'interviewer_closable'].includes(sortOn)) {
      return (a, b) => {
        const aString = (a.interviewer.interviewerLastName + a.interviewer.interviewerFirstName);
        const bString = (b.interviewer.interviewerLastName + b.interviewer.interviewerFirstName);
        if (aString < bString) {
          return -1 * mult;
        }
        if (aString !== bString) {
          return 1 * mult;
        }
        return mainSort ? mainSortFunc(a, b) : 0;
      };
    }
    return (a, b) => (a[sortOn] === b[sortOn] && mainSort
      ? mainSortFunc(a, b)
      : (a[sortOn] - b[sortOn]) * mult
    );
  }

  static sortData(data, sortOn, asc, mainSortAttr) {
    const sortedData = [...data];
    const attrs = {
      CPue: 'surveyUnitCount',
      CPidep: 'id',
    };
    const sortBy = attrs[sortOn] || sortOn;
    sortedData.sort(this.getSortFunction(sortBy, sortOn && !asc, mainSortAttr));
    return sortedData;
  }

  static addIfNotAlreadyPresent(array, element) {
    if (!array.some((elm) => elm.id === element.id)) {
      array.push(element);
    }
  }

  static sumOn(data, groupBy) {
    const result = {};
    data
      .filter((elm) => elm.stateCount)
      .forEach((elm) => {
        if (!Object.prototype.hasOwnProperty.call(result, elm[groupBy])) {
          result[elm[groupBy]] = JSON.parse(JSON.stringify(elm));
        } else {
          Object.entries(elm.stateCount)
            .filter((x) => !isNaN(x[1]))
            .forEach(([key, val]) => {
              result[elm[groupBy]].stateCount[key] += val;
            });
        }
      });

    const finalArray = Object.keys(result).map((key) => {
      const formattedData = this.formatForMonitoringTable(result[key].stateCount);
      formattedData.interviewerFirstName = result[key].interviewerFirstName;
      formattedData.interviewerLastName = result[key].interviewerLastName;
      formattedData.interviewerId = result[key].interviewerId;
      return formattedData;
    });

    return finalArray;
  }

  static getStateCountSum(data) {
    const result = {};
    data
      .filter((elm) => elm.stateCount)
      .forEach((elm) => {
        Object.keys(elm.stateCount)
          .filter((key) => !isNaN(elm.stateCount[key]))
          .forEach((key) => {
            result[key] = (result[key] + elm.stateCount[key]) || elm.stateCount[key];
          });
      });

    return this.formatForMonitoringTable(result);
  }

  static sumElms(data) {
    const result = {};
    data
      .forEach((elm) => {
        Object.keys(elm)
          .filter((key) => !isNaN(elm[key]))
          .forEach((key) => {
            result[key] = (result[key] + elm[key]) || elm[key];
          });
      });
    return result;
  }

  static getMonitoringTableModeFromPath(path) {
    if (path.includes('/sites/')) {
      return C.BY_SITE;
    }
    if (path.includes('/interviewer')) {
      return C.BY_SURVEY_ONE_INTERVIEWER;
    }
    if (path.includes('/campaigns')) {
      return C.BY_SURVEY;
    }
    if (path.includes('/interviewers')) {
      return C.BY_INTERVIEWER;
    }
    return C.BY_INTERVIEWER_ONE_SURVEY;
  }

  static isVisible(survey, date) {
    let dateToUse = date || new Date().getTime();
    if (typeof dateToUse === 'string') {
      dateToUse = new Date(dateToUse).getTime();
    }
    return (
      survey.managementStartDate < dateToUse
      && (!survey.endDate || survey.endDate > dateToUse)
    );
  }

  static handleSort(sortOn, data, sort, view, asc) {
    let newOrder = asc;
    if (asc === undefined) {
      newOrder = sortOn !== sort.sortOn || !sort.asc;
    }
    let sortedData = {};
    switch (view) {
      case 'mainScreen':
        sortedData = this.sortData(data, sortOn, newOrder, 'label');
        break;
      case 'listSU':
        sortedData = this.sortData(data, sortOn, newOrder, 'id');
        break;
      case 'terminated':
        sortedData = this.sortData(data, sortOn, newOrder, 'campaignLabel');
        break;
      case 'campaignPortal':
        Object.assign(sortedData, data);
        sortedData.interviewers = this.sortData(data.interviewers, sortOn, newOrder, 'CPinterviewer');
        break;
      case 'monitoringTable': {
        Object.assign(sortedData, data);
        let mainAttr;
        if (data.linesDetails.length > 0) {
          if (data.linesDetails[0].site) {
            mainAttr = 'site';
          } else if (data.linesDetails[0].survey) {
            mainAttr = 'survey';
          } else {
            mainAttr = 'CPinterviewer';
          }
        }
        sortedData.linesDetails = this.sortData(data.linesDetails, sortOn, newOrder, mainAttr);
        break;
      }
      case 'review':
        Object.assign(sortedData, data);
        sortedData = this.sortData(data, sortOn, newOrder, 'interviewer');
        break;
      default:
        Object.assign(sortedData, data);
        break;
    }

    return [sortedData, { sortOn, asc: newOrder }];
  }
}

export default Utils;
