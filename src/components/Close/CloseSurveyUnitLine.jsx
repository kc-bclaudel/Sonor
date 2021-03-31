import React from 'react';

function CloseSurveyUnitLine({ lineData, isChecked, updateFunc }) {
  const {
    campaign, id, ssech, location, city, interviewer, state,
  } = lineData;
  return (
    <tr>
      <td className="Clickable">
        <input key={lineData.id} type="checkbox" checked={isChecked} name={id} value={id} onChange={() => updateFunc()} />
      </td>
      <td>{campaign}</td>
      <td>{id}</td>
      <td>{`${interviewer.interviewerLastName} ${interviewer.interviewerFirstName}`}</td>
      <td>{ssech}</td>
      <td>{location ? location.substring(0, 2) : null}</td>
      <td>{city}</td>
      <td>{state}</td>
    </tr>
  );
}

export default CloseSurveyUnitLine;
