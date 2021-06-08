import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import D from '../../i18n';

function SurveyUnitLine({
  lineData, isChecked, updateFunc, handleShow, view,
}) {
  const {
    campaignLabel, interviewer, id, viewed,
  } = lineData;
  const queenUrl = `${window.localStorage.getItem('QUEEN_URL_FRONT_END')}`;
  return (
    <tr className={viewed ? '' : 'notViewed'}>
      <td className="CheckboxCol" onClick={() => updateFunc()}>
        <input key={id} type="checkbox" readOnly checked={isChecked} name={id} value={id} />
      </td>
      <td className="ColCampaign">{campaignLabel}</td>
      <td className="ColId">{id}</td>
      <td className="ColInterviewer">{interviewer}</td>
      <td className="ColAction">
        <OverlayTrigger
          placement="top"
          overlay={(
            <Tooltip>
              {D.questionnaire}
            </Tooltip>
          )}
        >
          <i
            className="fa fa-calendar EditLink Clickable"
            aria-hidden="true"
            onClick={() => { view(lineData); window.open(`${queenUrl}/queen/readonly/survey-unit/${lineData.id}`); }}
          />
        </OverlayTrigger>
        <span />
        <OverlayTrigger
          placement="top"
          overlay={(
            <Tooltip>
              {D.comment}
            </Tooltip>
          )}
        >
          <i
            className="fa fa-pencil EditCommentSurveyIcon Clickable"
            aria-hidden="true"
            onClick={() => handleShow()}
          />
        </OverlayTrigger>
      </td>
    </tr>
  );
}

export default SurveyUnitLine;
