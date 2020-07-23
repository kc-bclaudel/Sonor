import D from '../i18n';

class Utils {
  static convertToDateString(timestamp, locales, options) {
    return new Date(timestamp).toLocaleDateString(locales, options);
  }

  static calculateCompletionRate(data) {
    return (data.total - data.ansCount) / data.total;
  }

  static calculateOngoing(data) {
    return data.prcCount
          + data.aocCount
          + data.apsCount
          + data.insCount
          + data.wftCount
          + data.wfsCount;
  }

  static formatForMonitoringTable(stateCount) {
    const line = {};

    // TODO: apply bussiness rules
    line.completionRate = this.calculateCompletionRate(stateCount);
    line.total = stateCount.total;
    line.notStarted = stateCount.ansCount;
    line.onGoing = this.calculateOngoing(stateCount);
    line.waitingForIntValidation = stateCount.wftCount + stateCount.wfsCount;
    line.intValidated = stateCount.tbrCount;
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
    if (['campaignLabel', 'interviewer', 'label', 'id', 'survey', 'site'].includes(sortOn)) {
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
    const finalArray = [];
    const result = {};

    data.forEach((elm) => {
      if (!Object.prototype.hasOwnProperty.call(result, elm[groupBy])) {
        result[elm[groupBy]] = elm;
      } else {
        Object.keys(elm.stateCount).forEach((key) => {
          if (!isNaN(elm.stateCount[key])) {
            result[elm[groupBy]].stateCount[key] += elm.stateCount[key];
          }
        });
      }
    });

    Object.keys(result).forEach((key) => {
      const formattedData = this.formatForMonitoringTable(result[key].stateCount);
      formattedData.interviewerFirstName = result[key].interviewerFirstName;
      formattedData.interviewerLastName = result[key].interviewerLastName;
      formattedData.interviewerId = result[key].interviewerId;

      finalArray.push(formattedData);
    });

    return finalArray;
  }

  static getStateCountSum(data) {
    const result = {};

    data.forEach((elm) => {
      if (Object.keys(result).length < 1) {
        Object.assign(result, elm.stateCount);
      }
      Object.keys(elm.stateCount).forEach((key) => {
        if (!isNaN(elm.stateCount[key])) {
          result[key] += elm.stateCount[key];
        }
      });
    });

    return this.formatForMonitoringTable(result);
  }
}

export default Utils;
