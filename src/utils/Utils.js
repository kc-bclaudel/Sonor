import D from '../i18n';
import C from './constants.json';

class Utils {
  static convertToDateString(timestamp, locales, options) {
    return new Date(timestamp).toLocaleDateString(locales, options);
  }

  static convertMsToHoursMinutes(millis) {
    var date = new Date(millis);
    return date.getHours() + ":" + date.getMinutes();
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

  static formatForMonitoringTable(stateCount) {
    const line = {};
    line.completionRate = this.calculateCompletionRate(stateCount);
    line.total = stateCount.total;
    line.notStarted = stateCount.vicCount;
    line.onGoing = this.calculateOngoing(stateCount);
    line.waitingForIntValidation = stateCount.wftCount;
    line.intValidated = stateCount.tbrCount + stateCount.wfsCount;
    line.demValidated = stateCount.finCount;
    line.preparingContact = stateCount.prcCount;
    line.atLeastOneContact = stateCount.aocCount;
    line.appointmentTaken = stateCount.apsCount;
    line.interviewStarted = stateCount.insCount;

    line.interviewerFirstName = stateCount.interviewerFirstName;
    line.interviewerFirstName = stateCount.interviewerLastName;
    line.interviewerId = stateCount.interviewerId;

    return line;
  }

  static getCampaignPhase(collectionStartDate, collectionEndDate, treatmentEndDate) {
    const now = new Date().getTime();
    if (!collectionStartDate || now < collectionStartDate) {
      return 0;
    }
    if (!collectionEndDate || now < collectionEndDate) {
      return 1;
    }
    if (!treatmentEndDate || now < treatmentEndDate) {
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

  static getSortFunction(sortOn) {
    if (['city', 'departement', 'ssech', 'campaignLabel', 'interviewer', 'label', 'id', 'survey', 'site'].includes(sortOn)) {
      return (a, b) => (a[sortOn] < b[sortOn] ? -1 : 1);
    }
    if (sortOn === 'CPinterviewer') {
      return (a, b) => (
        (a.interviewerLastName + a.interviewerFirstName)
        < (b.interviewerLastName + b.interviewerFirstName) ? -1 : 1
      );
    }
    return (a, b) => a[sortOn] - b[sortOn];
  }

  static sortData(data, sortOn, asc) {
    const sortedData = [...data];
    const attrs = {
      CPue: 'surveyUnitCount',
      CPidep: 'id',
    };
    const sortBy = attrs[sortOn] || sortOn;
    sortedData.sort(this.getSortFunction(sortBy));
    if (sortOn && !asc) {
      sortedData.reverse();
    }
    return sortedData;
  }

  static addIfNotAlreadyPresent(array, element) {
    if (!array.some((elm) => elm.id === element.id)) {
      array.push(element);
    }
  }

  static sumOn(data, groupBy) {
    const result = {};

    data.forEach((elm) => {
      if (!Object.prototype.hasOwnProperty.call(result, elm[groupBy])) {
        result[elm[groupBy]] = elm;
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

    data.forEach((elm) => {
      if (Object.keys(result).length < 1) {
        Object.assign(result, elm.stateCount);
      }
      Object.keys(elm.stateCount)
        .filter((key) => !isNaN(elm.stateCount[key]))
        .forEach((key) => {
          result[key] += elm.stateCount[key];
        });
    });

    return this.formatForMonitoringTable(result);
  }

  static getMonitoringTableModeFromPath(path) {
    if (path.includes('/sites/')) {
      return C.BY_SITE;
    }
    if (path.includes('/campaigns')) {
      return C.BY_SURVEY;
    }
    if (path.includes('/interviewers')) {
      return C.BY_INTERVIEWERS;
    }
    return C.BY_INTERVIEWER_ONE_SURVEY;
  }

  static isVisible(survey, date) {
    let dateToUse = date || new Date().getTime();
    if (typeof dateToUse === 'string') {
      dateToUse = new Date(dateToUse).getTime();
    }
    return (
      survey.visibilityStartDate < dateToUse
      && (!survey.treatmentEndDate || survey.treatmentEndDate > dateToUse)
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
        sortedData = this.sortData(data, sortOn, newOrder);
        break;
      case 'campaignPortal':
        Object.assign(sortedData, data);
        sortedData.interviewers = this.sortData(data.interviewers, sortOn, newOrder);
        break;
      case 'monitoringTable':
        Object.assign(sortedData, data);
        sortedData.interviewersDetail = this.sortData(data.interviewersDetail, sortOn, newOrder);
        break;
      case 'review':
        Object.assign(sortedData, data);
        sortedData = this.sortData(data, sortOn, newOrder);
        break;
      case 'remind':
        Object.assign(sortedData, data);
        break;
      case 'listSU':
        sortedData = this.sortData(data, sortOn, newOrder);
        break;
      case 'terminated':
        sortedData = this.sortData(data, sortOn, newOrder);
        break;
      default:
        Object.assign(sortedData, data);
        break;
    }

    return [sortedData, { sortOn, asc: newOrder }];
  }
}

export default Utils;
