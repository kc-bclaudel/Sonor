import React from 'react';

function SurveyUnitLine({
  lineData, isChecked, updateFunc,
}) {
  const {
    campaignLabel, interviewer, id,
  } = lineData;
  return (
    <tr>
      <td className="Clickable"><input key={id} type="checkbox" checked={isChecked} name={id} value={id} onChange={() => updateFunc()} /></td>
      <td onClick={() => { window.open('', '_blank'); }} className="Clickable">{campaignLabel}</td>
      <td onClick={() => { window.open('', '_blank'); }} className="Clickable">{interviewer}</td>
      <td onClick={() => { window.open('', '_blank'); }} className="Clickable">{id}</td>
    </tr>
  );
}

export default SurveyUnitLine;
