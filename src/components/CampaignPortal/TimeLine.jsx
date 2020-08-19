import React from 'react';
import Utils from '../../utils/Utils';
import D from '../../i18n';

function TimeLine({ props }) {
  const {
    visibilityStartDate, collectionStartDate, collectionEndDate, treatmentEndDate, phase,
  } = props;
  return (
    <div id="TimeLine">
      <div id="PhaseMilestones">
        <div>{Utils.convertToDateString(visibilityStartDate)}</div>
        <div className="DateCenter">{Utils.convertToDateString(collectionStartDate)}</div>
        <div className="DateCenter">{Utils.convertToDateString(collectionEndDate)}</div>
        <div className="DateRight">{Utils.convertToDateString(treatmentEndDate)}</div>
      </div>
      <div id="PhaseDisplay">
        <div className={`${phase === 0 ? ' CurrentPhase' : ''}`}>{D.initialAssignment}</div>
        <div className={`${phase === 1 ? ' CurrentPhase' : ''}`}>{D.collectionInProgress}</div>
        <div className={`${phase > 1 ? ' CurrentPhase' : ''}`}>{D.collectionOver}</div>
      </div>
      <div id="PhaseMilestones">
        <div>{D.integration}</div>
        <div className="LabelCenter">{D.startOfCollection}</div>
        <div className="LabelCenter">{D.endOfCollection}</div>
        <div className="LabelRight">{D.endOfTreatment}</div>
      </div>
    </div>
  );
}

export default TimeLine;
