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
    let phase = '';
    if (!collectionStartDate || now < collectionStartDate) {
      phase = 'Affectation initiale';
    } else if (!collectionEndDate || now < collectionEndDate) {
      phase = 'Collecte en cours';
    } else if (!treatmentEndDate || now < treatmentEndDate) {
      phase = 'Collecte terminée';
    } else {
      phase = 'Traitement terminée';
    }
    return phase;
  }
}

export default Utils;
