import React from 'react';
import { Link } from 'react-router-dom';
import Utils from '../../utils/Utils';

function SurveyListLine({ lineData, allData }) {
  const data = lineData;
  const survey = {
    id: data.id,
    label: data.label,
    collectionStartDate: data.collectionStartDate,
    endDate: data.endDate,
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
      <td className="ColSurvey">
        <Link to={monitoringTablebySite}>
          {data.label}
        </Link>
      </td>
      <td className="ColumnSpacing" />
      <td className="ColCollectionStartDate">
        <Link to={portal}>
          {Utils.convertToDateString(data.collectionStartDate)}
        </Link>
      </td>
      <td className="ColCollectionEndDate">
        <Link to={portal}>
          {Utils.convertToDateString(data.collectionEndDate)}
        </Link>
      </td>
      <td className="ColEndDate">
        <Link to={portal}>
          {Utils.convertToDateString(data.endDate)}
        </Link>
      </td>
      <td className="ColumnSpacing" />
      <td className="ColPhase">
        <Link to={portal}>
          {Utils.displayCampaignPhase(data.phase)}
        </Link>
      </td>
      <td className="ColumnSpacing" />
      <td className="ColAllocated">
        <Link to={listSU}>
          {data.allocated}
        </Link>
      </td>
      <td className="ColToProcessInterviewer">
        <Link to={monitoringTable}>
          {data.toProcessInterviewer}
        </Link>
      </td>
      <td className="ColToAffect">{data.toAffect}</td>
      <td className="ColToFollowUp">
        <Link to={followUp}>
          {data.toFollowUp}
        </Link>
      </td>
      <td className="ColToReview">
        <Link to={review}>
          {data.toReview}
        </Link>
      </td>
      <td className="ColFinalized">
        <Link to={terminated}>
          {data.finalized}
        </Link>
      </td>
    </tr>
  );
}

export default SurveyListLine;
