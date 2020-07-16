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

    line.completionRate = this.calculateCompletionRate(stateCount);
    line.total = stateCount.total;
    line.notStarted = stateCount.ansCount;
    line.onGoing = this.calculateOngoing(stateCount);
    line.waitingForIntValidation = stateCount.wftCount + stateCount.wfsCount;
    line.intValidated = stateCount.tbrCound;
    line.demValidated = stateCount.finCount;
    line.preparingContact = stateCount.prcCount;
    line.atLeastOneContact = stateCount.aocCount;
    line.appointmentTaken = stateCount.apsCount;
    line.interviewStarted = stateCount.insCount;

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
    if (['label', 'id'].includes(sortOn)) {
      return (a, b) => (a[sortOn] < b[sortOn] ? -1 : 1);
    }
    if (sortOn === 'CPinterviewer') {
      return (a, b) => (
        (a.interviewerFirstName + a.interviewerLastName)
        < (b.interviewerFirstName + b.interviewerLastName) ? -1 : 1
      );
    }
    return (a, b) => a[sortOn] - b[sortOn];
  }

  static sortData(data, sortOn, asc) {
    const sortedData = Object.assign(data);
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
}

export default Utils;
