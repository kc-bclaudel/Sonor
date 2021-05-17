import React from 'react';
import D from '../../i18n';

function SurveyUnitLine({ lineData, isChecked, updateFunc }) {
  const {
    id, ssech, departement, city, interviewer, state,
  } = lineData;
  return (
    <tr>
      <td className="Clickable ColCheckbox">
        <input key={lineData.id} type="checkbox" checked={isChecked} name={id} value={id} onChange={() => updateFunc()} />
      </td>
      <td className="ColId">{id}</td>
      <td className="ColInterviewer">{interviewer}</td>
      <td className="ColSsech">{ssech}</td>
      <td className="ColDepartement">{departement.substring(0, 2)}</td>
      <td className="ColCity">{city}</td>
      <td className="ColState">{state ? D[state] : ''}</td>
    </tr>
  );
}

export default SurveyUnitLine;
