import React from 'react';
import D from '../../i18n';

function CloseSurveyUnitLine({ lineData, isChecked, updateFunc }) {
  const {
    campaign, id, ssech, location, city, interviewer, state,
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
      <td className="ColLocation">{location ? location.substring(0, 2) : null}</td>
      <td className="ColCity">{city}</td>
      <td className="ColState">{state ? D[state] : ''}</td>
    </tr>
  );
}

export default CloseSurveyUnitLine;
