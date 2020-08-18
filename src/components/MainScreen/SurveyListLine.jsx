import React from 'react';
import { Link } from 'react-router-dom';
import Utils from '../../utils/Utils';

function SurveyListLine({ lineData, allData }) {
  const data = lineData;
  const survey = {
    id: data.id,
    label: data.label,
    visibilityStartDate: data.visibilityStartDate,
    treatmentEndDate: data.treatmentEndDate,
    allSurveys: allData,
  };

  const listSU = { pathname: `/listSU/${data.id}`, survey };
  const review = { pathname: `/review/${data.id}`, survey };
  const followUp = { pathname: `/followUp/${data.id}`, survey };
  const monitoringTable = { pathname: `/follow/campaign/${data.id}`, survey };
  const monitoringTablebySite = { pathname: `/follow/sites/${data.id}`, survey };
  const terminated = { pathname: `/terminated/${data.id}`, survey };

  const portal = {
    pathname: `/portal/${data.id}`,
    surveyInfos: { survey, surveyInfo: data },
  };

  return (
    <tr>
      <td>
        <Link to={monitoringTablebySite} className="TableLink">
          {data.label}
        </Link>
      </td>
      <td className="ColumnSpacing" />
      <td>
        <Link to={portal} className="TableLink">
          {Utils.convertToDateString(data.collectionStartDate)}
        </Link>
      </td>
      <td>
        <Link to={portal} className="TableLink">
          {Utils.convertToDateString(data.collectionEndDate)}
        </Link>
      </td>
      <td>
        <Link to={portal} className="TableLink">
          {Utils.convertToDateString(data.treatmentEndDate)}
        </Link>
      </td>
      <td className="ColumnSpacing" />
      <td>
        <Link to={portal} className="TableLink">
          {Utils.displayCampaignPhase(data.phase)}
        </Link>
      </td>
      <td className="ColumnSpacing" />
      <td>
        <Link to={listSU} className="TableLink">
          {data.allocated}
        </Link>
      </td>
      <td>
        <Link to={monitoringTable} className="TableLink">
          {data.toProcessInterviewer}
        </Link>
      </td>
      <td>{data.toAffect}</td>
      <td>
        <Link to={followUp} className="TableLink">
          {data.toFollowUp}
        </Link>
      </td>
      <td>
        <Link to={review} className="TableLink">
          {data.toReview}
        </Link>
      </td>
      <td>
        <Link to={terminated} className="TableLink">
          {data.finalized}
        </Link>
      </td>
    </tr>
  );
}

export default SurveyListLine;
