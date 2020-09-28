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
    <tr className="WithTableLink">
      <td>
        <Link to={monitoringTablebySite}>
          {data.label}
        </Link>
      </td>
      <td className="ColumnSpacing" />
      <td>
        <Link to={portal}>
          {Utils.convertToDateString(data.collectionStartDate)}
        </Link>
      </td>
      <td>
        <Link to={portal}>
          {Utils.convertToDateString(data.collectionEndDate)}
        </Link>
      </td>
      <td>
        <Link to={portal}>
          {Utils.convertToDateString(data.treatmentEndDate)}
        </Link>
      </td>
      <td className="ColumnSpacing" />
      <td>
        <Link to={portal}>
          {Utils.displayCampaignPhase(data.phase)}
        </Link>
      </td>
      <td className="ColumnSpacing" />
      <td>
        <Link to={listSU}>
          {data.allocated}
        </Link>
      </td>
      <td>
        <Link to={monitoringTable}>
          {data.toProcessInterviewer}
        </Link>
      </td>
      <td>{data.toAffect}</td>
      <td>
        <Link to={followUp}>
          {data.toFollowUp}
        </Link>
      </td>
      <td>
        <Link to={review}>
          {data.toReview}
        </Link>
      </td>
      <td>
        <Link to={terminated}>
          {data.finalized}
        </Link>
      </td>
    </tr>
  );
}

export default SurveyListLine;
