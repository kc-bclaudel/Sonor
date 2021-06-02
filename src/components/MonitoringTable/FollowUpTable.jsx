import React from 'react';
import Table from 'react-bootstrap/Table';
import SortIcon from '../SortIcon/SortIcon';
import FollowUpTableLine from './FollowUpTableLine';
import C from '../../utils/constants.json';
import D from '../../i18n';
import './MonitoringTable.css';

function FollowUpTable({
  data, sort, displayedLines, pagination, mode, handleSort,
}) {
  const totalDemRow = mode !== C.BY_INTERVIEWER_ONE_SURVEY || (
    <tr>
      <th className="ColFirstCol">{D.totalDEM}</th>
      <th className="ColumnSpacing" />
      <th className="YellowHeader ColCompletionRate">
        {Number.isNaN(data.total.dem.completionRate) || (
          <>
            {(data.total.dem.completionRate * 100).toFixed(1)}
            %
          </>
        )}
      </th>
      <th className="ColumnSpacing" />
      <th className="ColAllocated">{data.total.dem.total}</th>
      <th className="ColNotStarted">{data.total.dem.notStarted}</th>
      <th className="ColOngoing">{data.total.dem.onGoing}</th>
      <th className="ColWaitingForIntVal">{data.total.dem.waitingForIntValidation}</th>
      <th className="ColIntVal">{data.total.dem.intValidated}</th>
      <th className="ColDemVal">{data.total.dem.demValidated}</th>
      <th className="ColumnSpacing" />
      <th className="YellowHeader ColPreparingContact">{data.total.dem.preparingContact}</th>
      <th className="YellowHeader ColAtLeastOneContact">{data.total.dem.atLeastOneContact}</th>
      <th className="YellowHeader ColAppointmentTaken">{data.total.dem.appointmentTaken}</th>
      <th className="YellowHeader ColInterviewStarted">{data.total.dem.interviewStarted}</th>
    </tr>
  );

  const tableFooter = (mode !== C.BY_INTERVIEWER_ONE_SURVEY && mode !== C.BY_SITE) || (
    <tfoot>
      {totalDemRow}
      <tr>
        <th className="ColFirstCol">{D.totalFrance}</th>
        <th className="ColumnSpacing" />
        <th className="YellowHeader ColCompletionRate">
          {Number.isNaN(data.total.france.completionRate) || (
            <>
              {(data.total.france.completionRate * 100).toFixed(1)}
              %
            </>
          )}
        </th>
        <th className="ColumnSpacing" />
        <th className="ColAllocated">{data.total.france.total}</th>
        <th className="ColNotStarted">{data.total.france.notStarted}</th>
        <th className="ColOngoing">{data.total.france.onGoing}</th>
        <th className="ColWaitingForIntVal">{data.total.france.waitingForIntValidation}</th>
        <th className="ColIntVal">{data.total.france.intValidated}</th>
        <th className="ColDemVal">{data.total.france.demValidated}</th>
        <th className="ColumnSpacing" />
        <th className="YellowHeader ColPreparingContact">{data.total.france.preparingContact}</th>
        <th className="YellowHeader ColAtLeastOneContact">{data.total.france.atLeastOneContact}</th>
        <th className="YellowHeader ColAppointmentTaken">{data.total.france.appointmentTaken}</th>
        <th className="YellowHeader ColInterviewStarted">{data.total.france.interviewStarted}</th>
      </tr>
    </tfoot>
  );
  let firstColumnTitle;
  let firstColumnSortAttribute;
  if (mode === C.BY_SURVEY || mode === C.BY_SURVEY_ONE_INTERVIEWER) {
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
          <th className="EmptyHeader ColFirstCol" />
          <th className="ColumnSpacing" />
          <th className="EmptyHeader ColCompletionRate" />
          <th rowSpan="2" className="ColumnSpacing" />
          <th colSpan="6" className="CenteredText">{D.numberOfSurveyUnits}</th>
          <th rowSpan="2" className="ColumnSpacing" />
          <th colSpan="4" className="YellowHeader CenteredText">{D.suCollectionsOngoing}</th>
        </tr>
        <tr>
          <th
            data-testid="TableHeader_label"
            onClick={handleSortFunct(firstColumnSortAttribute)}
            className="Clickable ColFirstCol"
          >
            {firstColumnTitle}
            <SortIcon val={firstColumnSortAttribute} sort={sort} />
          </th>
          <th className="ColumnSpacing" />
          <th
            className="YellowHeader ColCompletionRate"
            onClick={handleSortFunct('completionRate')}
          >
            {D.completionRate}
            <SortIcon val="completionRate" sort={sort} />
          </th>
          <th
            onClick={handleSortFunct('total')}
            className="Clickable ColAllocated"
          >
            {D.allocated}
            <SortIcon val="total" sort={sort} />
          </th>
          <th
            onClick={handleSortFunct('notStarted')}
            className="Clickable ColNotStarted"
          >
            {D.notStarted}
            <SortIcon val="notStarted" sort={sort} />
          </th>
          <th
            onClick={handleSortFunct('onGoing')}
            className="Clickable ColOngoing"
          >
            {D.inProgressInterviewer}
            <SortIcon val="onGoing" sort={sort} />
          </th>
          <th
            onClick={handleSortFunct('waitingForIntValidation')}
            className="Clickable ColWaitingForIntVal"
          >
            {D.waitingForIntReview}
            <SortIcon val="waitingForIntValidation" sort={sort} />
          </th>
          <th
            onClick={handleSortFunct('intValidated')}
            className="Clickable ColIntVal"
          >
            {D.reviewedByInterviewer}
            <SortIcon val="intValidated" sort={sort} />
          </th>
          <th
            onClick={handleSortFunct('demValidated')}
            className="Clickable ColDemVal"
          >
            {D.reviewedEnded}
            <SortIcon val="demValidated" sort={sort} />
          </th>
          <th
            className="YellowHeader Clickable ColPreparingContact"
            onClick={handleSortFunct('preparingContact')}
          >
            {D.preparingContact}
            <SortIcon val="preparingContact" sort={sort} />
          </th>
          <th
            className="YellowHeader Clickable ColAtLeastOneContact"
            onClick={handleSortFunct('atLeastOneContact')}
          >
            {D.atLeastOneContact}
            <SortIcon val="atLeastOneContact" sort={sort} />
          </th>
          <th
            className="YellowHeader Clickable ColAppointmentTaken"
            onClick={handleSortFunct('appointmentTaken')}
          >
            {D.appointmentTaken}
            <SortIcon val="appointmentTaken" sort={sort} />
          </th>
          <th
            className="YellowHeader Clickable ColInterviewStarted"
            onClick={handleSortFunct('interviewStarted')}
          >
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
          .map((line) => (
            <FollowUpTableLine key={line.interviewerId || line.survey || line.site} data={line} />
          ))}
      </tbody>
      {tableFooter}
    </Table>
  );
}

export default FollowUpTable;
