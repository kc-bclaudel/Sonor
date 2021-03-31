import React from 'react';

function SurveyUnitLine({
  lineData, isChecked, updateFunc, handleShow
}) {
  const {
    campaignLabel, interviewer, id,
  } = lineData;
  const queenUrl = `${window.localStorage.getItem('QUEEN_URL_FRONT_END')}`;

  return (
    <tr>
      <td className="CheckboxCol" onClick={() => updateFunc()}>
        <input key={id} type="checkbox" checked={isChecked} name={id} value={id} />
      </td>
      <td>{campaignLabel}</td>
      <td>{id}</td>
      <td>{interviewer}</td>
      <td>
          <i
            className="fa fa-calendar EditLink Clickable"
            aria-hidden="true"
            onClick={() => { window.open(`${queenUrl}/queen/readonly/questionnaire/${lineData.campaignId}/survey-unit/${lineData.id}`); }}
          />
          <span/>
          <i
            className="fa fa-pencil EditCommentSurveyIcon Clickable"
            aria-hidden="true"
            onClick={() => handleShow()}
          />
      </td>
    </tr>
  );
}

export default SurveyUnitLine;
