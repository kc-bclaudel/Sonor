import React from 'react';

function SurveyUnitLine({
  lineData, isChecked, updateFunc,
}) {
  const {
    campaignLabel, interviewer, id,
  } = lineData;
  const queenUrl = `${window.localStorage.getItem('QUEEN_URL_FRONT_END')}`;

  return (
    <tr>
      <td className="Clickable">
        <input key={id} type="checkbox" checked={isChecked} name={id} value={id} onChange={() => updateFunc()} />
      </td>
      <td onClick={() => { window.open(`${queenUrl}/queen/readonly/questionnaire/${lineData.campaignId}/survey-unit/${lineData.id}`); }} className="Clickable">{campaignLabel}</td>
      <td onClick={() => { window.open(`${queenUrl}/queen/readonly/questionnaire/${lineData.campaignId}/survey-unit/${lineData.id}`); }} className="Clickable">{interviewer}</td>
      <td onClick={() => { window.open(`${queenUrl}/queen/readonly/questionnaire/${lineData.campaignId}/survey-unit/${lineData.id}`); }} className="Clickable">{id}</td>
    </tr>
  );
}

export default SurveyUnitLine;
