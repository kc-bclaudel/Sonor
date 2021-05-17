import React from 'react';
import Utils from '../../utils/Utils';
import D from '../../i18n';

function TimeLine({ props }) {
  const {
    managementStartDate, collectionStartDate, collectionEndDate, endDate, phase,
  } = props;
  return (
    <div id="TimeLine">
      <div id="PhaseMilestones">
        <div className="PhaseSmall">{Utils.convertToDateString(managementStartDate)}</div>
        <div className="DateCenter PhaseLarge">{Utils.convertToDateString(collectionStartDate)}</div>
        <div className="DateCenter PhaseSmall">{Utils.convertToDateString(collectionEndDate)}</div>
        <div className="DateRight PhaseSmall">{Utils.convertToDateString(endDate)}</div>
      </div>
      <div id="PhaseDisplay">
        <div className={`PhaseSmall ${phase === 0 ? ' CurrentPhase' : 'PastPhase'}`} >{D.initialAssignment}</div>
        <div className={`PhaseLarge ${phase === 1 ? ' CurrentPhase' : phase === 0 ? ' ' : 'PastPhase'}`}>{D.collectionInProgress}</div>
        <div className={`PhaseSmall ${phase > 1 ? ' CurrentPhase' : ''}`}>{D.collectionOver}</div>
      </div>
      <div id="PhaseMilestones">
        <div className="PhaseSmall">{D.integration}</div>
        <div className="LabelCenter PhaseLarge">{D.startOfCollection}</div>
        <div className="LabelCenter PhaseSmall">{D.endOfCollection}</div>
        <div className="LabelRight PhaseSmall">{D.endOfTreatment}</div>
      </div>
    </div>
  );
}

export default TimeLine;
