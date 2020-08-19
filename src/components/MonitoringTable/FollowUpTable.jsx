import React from 'react';
import Table from 'react-bootstrap/Table';
import SortIcon from '../SortIcon/SortIcon';
import FollowUpTableLine from './FollowUpTableLine';
import C from '../../utils/constants.json';
import D from '../../i18n';

function FollowUpTable({
  data, sort, displayedLines, pagination, mode, handleSort,
}) {
  const totalDemRow = mode !== C.BY_INTERVIEWER_ONE_SURVEY || (
    <tr>
      <th>{D.totalDEM}</th>
      <th className="ColumnSpacing" />
      <th className="YellowHeader">
        {(data.total.dem.completionRate * 100).toFixed(1)}
        %
      </th>
      <th className="ColumnSpacing" />
      <th>{data.total.dem.total}</th>
      <th>{data.total.dem.notStarted}</th>
      <th>{data.total.dem.onGoing}</th>
      <th>{data.total.dem.waitingForIntValidation}</th>
      <th>{data.total.dem.intValidated}</th>
      <th>{data.total.dem.demValidated}</th>
      <th className="ColumnSpacing" />
      <th className="YellowHeader">{data.total.dem.preparingContact}</th>
      <th className="YellowHeader">{data.total.dem.atLeastOneContact}</th>
      <th className="YellowHeader">{data.total.dem.appointmentTaken}</th>
      <th className="YellowHeader">{data.total.dem.interviewStarted}</th>
    </tr>
  );

  const tableFooter = (mode !== C.BY_INTERVIEWER_ONE_SURVEY && mode !== C.BY_SITE) || (
    <tfoot>
      {totalDemRow}
      <tr>
        <th>{D.totalFrance}</th>
        <th className="ColumnSpacing" />
        <th className="YellowHeader">
          {(data.total.france.completionRate * 100).toFixed(1)}
          %
        </th>
        <th className="ColumnSpacing" />
        <th>{data.total.france.total}</th>
        <th>{data.total.france.notStarted}</th>
        <th>{data.total.france.onGoing}</th>
        <th>{data.total.france.waitingForIntValidation}</th>
        <th>{data.total.france.intValidated}</th>
        <th>{data.total.france.demValidated}</th>
        <th className="ColumnSpacing" />
        <th className="YellowHeader">{data.total.france.preparingContact}</th>
        <th className="YellowHeader">{data.total.france.atLeastOneContact}</th>
        <th className="YellowHeader">{data.total.france.appointmentTaken}</th>
        <th className="YellowHeader">{data.total.france.interviewStarted}</th>
      </tr>
    </tfoot>
  );
  let firstColumnTitle;
  let firstColumnSortAttribute;
  if (mode === C.BY_SURVEY) {
    firstColumnTitle = D.survey;
    firstColumnSortAttribute = 'survey';
  } else if (mode === C.BY_SITE) {
    firstColumnTitle = D.site;
    firstColumnSortAttribute = 'site';
  } else {
    firstColumnTitle = D.interviewer;
    firstColumnSortAttribute = 'CPinterviewer';
  }
  function handleSortFunct(property) { return () => { handleSort(property); }; }

  return (
    <Table id="FollowUpTable" className="CustomTable" bordered striped hover responsive size="sm">
      <thead>
        <tr>
          <th rowSpan="2" onClick={handleSortFunct(firstColumnSortAttribute)}>
            {firstColumnTitle}
            <SortIcon val={firstColumnSortAttribute} sort={sort} />
          </th>
          <th rowSpan="2" className="ColumnSpacing" />
          <th rowSpan="2" className="YellowHeader" onClick={handleSortFunct('completionRate')}>
            {D.completionRate}
            <SortIcon val="completionRate" sort={sort} />
          </th>
          <th rowSpan="2" className="ColumnSpacing" />
          <th colSpan="6">{D.numberOfSurveyUnits}</th>
          <th rowSpan="2" className="ColumnSpacing" />
          <th colSpan="4" className="YellowHeader">{D.suCollectionsOngoing}</th>
        </tr>
        <tr>
          <th onClick={handleSortFunct('total')}>
            {D.allocated}
            <SortIcon val="total" sort={sort} />
          </th>
          <th onClick={handleSortFunct('notStarted')}>
            {D.notStarted}
            <SortIcon val="notStarted" sort={sort} />
          </th>
          <th onClick={handleSortFunct('onGoing')}>
            {D.inProgressInterviewer}
            <SortIcon val="onGoing" sort={sort} />
          </th>
          <th onClick={handleSortFunct('waitingForIntValidation')}>
            {D.waitingForIntReview}
            <SortIcon val="waitingForIntValidation" sort={sort} />
          </th>
          <th onClick={handleSortFunct('intValidated')}>
            {D.reviewedByInterviewer}
            <SortIcon val="intValidated" sort={sort} />
          </th>
          <th onClick={handleSortFunct('demValidated')}>
            {D.reviewedEnded}
            <SortIcon val="demValidated" sort={sort} />
          </th>
          <th className="YellowHeader" onClick={handleSortFunct('preparingContact')}>
            {D.preparingContact}
            <SortIcon val="preparingContact" sort={sort} />
          </th>
          <th className="YellowHeader" onClick={handleSortFunct('atLeastOneContact')}>
            {D.atLeastOneContact}
            <SortIcon val="atLeastOneContact" sort={sort} />
          </th>
          <th className="YellowHeader" onClick={handleSortFunct('appointmentTaken')}>
            {D.appointmentTaken}
            <SortIcon val="appointmentTaken" sort={sort} />
          </th>
          <th className="YellowHeader" onClick={handleSortFunct('interviewStarted')}>
            {D.interviewStarted}
            <SortIcon val="interviewStarted" sort={sort} />
          </th>
        </tr>
      </thead>
      <tbody>
        {displayedLines
          .slice(
            (pagination.page - 1) * pagination.size,
            Math.min(pagination.page * pagination.size, displayedLines.length),
          )
          .map((line) => (<FollowUpTableLine key={line.interviewerId || line.survey || line.site} data={line} />))}
      </tbody>
      {tableFooter}
    </Table>
  );
}

export default FollowUpTable;
