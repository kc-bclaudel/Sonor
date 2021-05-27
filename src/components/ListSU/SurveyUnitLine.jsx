import React from 'react';
import D from '../../i18n';

function SurveyUnitLine({ lineData, isChecked, updateFunc }) {
  const {
    id, ssech, departement, city, interviewer, state, closingCause,
  } = lineData;
  return (
    <tr>
      <td className="Clickable ColCheckbox">
        {
          state !== 'CLO' && state !== 'TBR' && state !== 'FIN' ? (
            <input key={lineData.id} type="checkbox" checked={isChecked} name={id} value={id} onChange={() => updateFunc()} />
          ) : <span />
        }
      </td>
      <td className="ColId">{id}</td>
      <td className="ColInterviewer">{interviewer}</td>
      <td className="ColSsech">{ssech}</td>
      <td className="ColDepartement">{departement.substring(0, 2)}</td>
      <td className="ColCity">{city}</td>
      <td className="ColState">{closingCause ? D[closingCause] : ''}</td>
    </tr>
  );
}

export default SurveyUnitLine;
