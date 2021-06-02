import React from 'react';
import D from '../../i18n';

function CloseSurveyUnitLine({ lineData, isChecked, updateFunc }) {
  const {
    campaign, id, ssech, contactOutcome, questionnaireState, interviewer, closingCause,
  } = lineData;
  return (
    <tr>
      <td className="Clickable ColCheckbox">
        <input key={lineData.id} type="checkbox" checked={isChecked} name={id} value={id} onChange={() => updateFunc()} />
      </td>
      <td className="ColCampaign">{campaign}</td>
      <td className="ColId">{id}</td>
      <td className="ColInterviewer">{`${interviewer.interviewerLastName} ${interviewer.interviewerFirstName}`}</td>
      <td className="ColSsech">{ssech}</td>
      <td className="ColLocation">{contactOutcome ? D[contactOutcome] : ''}</td>
      <td className="ColCity">{questionnaireState ? D[questionnaireState] : ''}</td>
      <td className="ColState">{closingCause ? D[closingCause] : ''}</td>
    </tr>
  );
}

export default CloseSurveyUnitLine;
