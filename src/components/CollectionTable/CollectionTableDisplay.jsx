import React from 'react';
import Table from 'react-bootstrap/Table';
import SortIcon from '../SortIcon/SortIcon';
import CollectionTableDisplayLine from './CollectionTableDisplayLine';
import C from '../../utils/constants.json';
import D from '../../i18n';

function CollectionTableDisplay({
  data, sort, displayedLines, pagination, mode, handleSort,
}) {
  const notAttributedRow = mode !== C.BY_INTERVIEWER_ONE_SURVEY || (
    <tr>
      <th>{D.unitsNotAffected}</th>
      <th className="ColumnSpacing" />
      <th className="YellowHeader">
        {(data.notAttributed.collectionRate * 100).toFixed(1)}
        %
      </th>
      <th className="YellowHeader">
        {(data.notAttributed.wasteRate * 100).toFixed(1)}
        %
      </th>
      <th className="YellowHeader">
        {(data.notAttributed.outOfScopeRate * 100).toFixed(1)}
        %
      </th>
      <th className="ColumnSpacing" />
      <th>{data.notAttributed.surveysAccepted}</th>
      <th>{data.notAttributed.refusal}</th>
      <th>{data.notAttributed.unreachable}</th>
      <th>{data.notAttributed.otherWastes}</th>
      <th>{data.notAttributed.outOfScope}</th>
      <th>{data.notAttributed.totalProcessed}</th>
      <th className="ColumnSpacing" />
      <th className="YellowHeader">{data.notAttributed.absInterviewer}</th>
      <th className="YellowHeader">{data.notAttributed.otherReason}</th>
      <th className="YellowHeader">{data.notAttributed.totalClosed}</th>
      <th className="ColumnSpacing" />
      <th className="YellowHeader">{data.notAttributed.allocated}</th>
    </tr>
  );

  const totalDemRow = mode !== C.BY_INTERVIEWER_ONE_SURVEY || (
    <tr>
      <th>{D.totalDEM}</th>
      <th className="ColumnSpacing" />
      <th className="YellowHeader">
        {(data.total.dem.collectionRate * 100).toFixed(1)}
        %
      </th>
      <th className="YellowHeader">
        {(data.total.dem.wasteRate * 100).toFixed(1)}
        %
      </th>
      <th className="YellowHeader">
        {(data.total.dem.outOfScopeRate * 100).toFixed(1)}
        %
      </th>
      <th className="ColumnSpacing" />
      <th>{data.total.dem.surveysAccepted}</th>
      <th>{data.total.dem.refusal}</th>
      <th>{data.total.dem.unreachable}</th>
      <th>{data.total.dem.otherWastes}</th>
      <th>{data.total.dem.outOfScope}</th>
      <th>{data.total.dem.totalProcessed}</th>
      <th className="ColumnSpacing" />
      <th className="YellowHeader">{data.total.dem.absInterviewer}</th>
      <th className="YellowHeader">{data.total.dem.otherReason}</th>
      <th className="YellowHeader">{data.total.dem.totalClosed}</th>
      <th className="ColumnSpacing" />
      <th className="YellowHeader">{data.total.dem.allocated}</th>
    </tr>
  );

  const tableFooter = (mode !== C.BY_INTERVIEWER_ONE_SURVEY && mode !== C.BY_SITE) || (
    <tfoot>
      {notAttributedRow}
      {totalDemRow}
      <tr>
        <th>{D.totalFrance}</th>
        <th className="ColumnSpacing" />
        <th className="YellowHeader">
          {(data.total.france.collectionRate * 100).toFixed(1)}
          %
        </th>
        <th className="YellowHeader">
          {(data.total.france.wasteRate * 100).toFixed(1)}
          %
        </th>
        <th className="YellowHeader">
          {(data.total.france.outOfScopeRate * 100).toFixed(1)}
          %
        </th>
        <th className="ColumnSpacing" />
        <th>{data.total.france.surveysAccepted}</th>
        <th>{data.total.france.refusal}</th>
        <th>{data.total.france.unreachable}</th>
        <th>{data.total.france.otherWastes}</th>
        <th>{data.total.france.outOfScope}</th>
        <th>{data.total.france.totalProcessed}</th>
        <th className="ColumnSpacing" />
        <th className="YellowHeader">{data.total.france.absInterviewer}</th>
        <th className="YellowHeader">{data.total.france.otherReason}</th>
        <th className="YellowHeader">{data.total.france.totalClosed}</th>
        <th className="ColumnSpacing" />
        <th className="YellowHeader">{data.total.france.allocated}</th>
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
          <th className="EmptyHeader" />
          <th className="ColumnSpacing" />
          <th className="EmptyHeader" />
          <th className="EmptyHeader" />
          <th className="EmptyHeader" />
          <th rowSpan="2" className="ColumnSpacing" />
          <th colSpan="6" className="CenteredText">{D.surveyUnitsProcessedInterviewer}</th>
          <th rowSpan="2" className="ColumnSpacing" />
          <th colSpan="3" className="CenteredText">{D.surveyUnitsProcessedInterviewer}</th>
          <th rowSpan="2" className="ColumnSpacing" />
          <th className="EmptyHeader" />
        </tr>
        <tr>
          <th
            data-testid="TableHeader_label"
            onClick={handleSortFunct(firstColumnSortAttribute)}
            className="Clickable"
          >
            {firstColumnTitle}
            <SortIcon val={firstColumnSortAttribute} sort={sort} />
          </th>
          <th className="ColumnSpacing" />
          <th
            className="YellowHeader Clickable"
            onClick={handleSortFunct('collectionRate')}
          >
            {D.collectionRate}
            <SortIcon val="collectionRate" sort={sort} />
          </th>
          <th
            onClick={handleSortFunct('wasteRate')}
            className="YellowHeader Clickable"
          >
            {D.wasteRate}
            <SortIcon val="wasteRate" sort={sort} />
          </th>
          <th
            onClick={handleSortFunct('outOfScopeRate')}
            className="YellowHeader Clickable"
          >
            {D.outOfScopeRate}
            <SortIcon val="outOfScopeRate" sort={sort} />
          </th>
          <th
            onClick={handleSortFunct('surveysAccepted')}
            className="Clickable"
          >
            {D.surveysAccepted}
            <SortIcon val="surveysAccepted" sort={sort} />
          </th>
          <th
            onClick={handleSortFunct('refusal')}
            className="Clickable"
          >
            {D.refusal}
            <SortIcon val="refusal" sort={sort} />
          </th>
          <th
            onClick={handleSortFunct('unreachable')}
            className="Clickable"
          >
            {D.unreachable}
            <SortIcon val="unreachable" sort={sort} />
          </th>
          <th
            onClick={handleSortFunct('otherWastes')}
            className="Clickable"
          >
            {D.otherWastes}
            <SortIcon val="otherWastes" sort={sort} />
          </th>
          <th
            className="Clickable"
            onClick={handleSortFunct('outOfScope')}
          >
            {D.outOfScope}
            <SortIcon val="outOfScope" sort={sort} />
          </th>
          <th
            className="Clickable"
            onClick={handleSortFunct('totalProcessed')}
          >
            {D.totalProcessed}
            <SortIcon val="totalProcessed" sort={sort} />
          </th>
          <th
            className="Clickable"
            onClick={handleSortFunct('absInterviewer')}
          >
            {D.absInterviewer}
            <SortIcon val="absInterviewer" sort={sort} />
          </th>
          <th
            className="Clickable"
            onClick={handleSortFunct('otherReason')}
          >
            {D.otherReason}
            <SortIcon val="otherReason" sort={sort} />
          </th>
          <th
            className="Clickable"
            onClick={handleSortFunct('totalClosed')}
          >
            {D.totalClosed}
            <SortIcon val="totalClosed" sort={sort} />
          </th>
          <th
            className="Clickable"
            onClick={handleSortFunct('allocated')}
          >
            {D.allocated}
            <SortIcon val="allocated" sort={sort} />
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
            <CollectionTableDisplayLine key={line.interviewerId || line.survey || line.site} data={line} />
          ))}
      </tbody>
      {tableFooter}
    </Table>
  );
}

export default CollectionTableDisplay;
