import React from 'react';
import D from '../../i18n';

function SurveyUnitLine({ lineData, isChecked, updateFunc }) {
  const {
    id, ssech, departement, city, interviewer, state
  } = lineData;
  return (
    <tr>
      <td className="Clickable">
        <input key={lineData.id} type="checkbox" checked={isChecked} name={id} value={id} onChange={() => updateFunc()} />
      </td>
      <td>{id}</td>
      <td>{interviewer}</td>
      <td>{ssech}</td>
      <td>{departement.substring(0, 2)}</td>
      <td>{city}</td>
      <td>{state ? D[state] : ''}</td>
    </tr>
  );
}

export default SurveyUnitLine;
