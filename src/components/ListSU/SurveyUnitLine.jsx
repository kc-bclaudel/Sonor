import React from 'react';

function SurveyUnitLine({ lineData }) {
  const {
    id, ssech, departement, city, interviewer,
  } = lineData;
  return (
    <tr>
      <td>{id}</td>
      <td>{ssech}</td>
      <td>{departement.substring(0, 2)}</td>
      <td>{city}</td>
      <td>{interviewer}</td>
    </tr>
  );
}

export default SurveyUnitLine;
