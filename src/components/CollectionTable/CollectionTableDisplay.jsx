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
      <th className="ColFirstCol">{D.unitsNotAffected}</th>
      <th className="ColumnSpacing" />
      <th className="YellowHeader ColCollectionRate">
        {Number.isNaN(data.notAttributed.collectionRate) || (
          <>
            {(data.notAttributed.collectionRate * 100).toFixed(1)}
            %
          </>
        )}
      </th>
      <th className="YellowHeader ColWasteRate">
        {Number.isNaN(data.notAttributed.wasteRate) || (
          <>
            {(data.notAttributed.wasteRate * 100).toFixed(1)}
            %
          </>
        )}
      </th>
      <th className="YellowHeader ColOOSRate">
        {Number.isNaN(data.notAttributed.outOfScopeRate) || (
          <>
            {(data.notAttributed.outOfScopeRate * 100).toFixed(1)}
            %
          </>
        )}
      </th>
      <th className="ColumnSpacing" />
      <th className="ColSurveyAcepted">{data.notAttributed.surveysAccepted}</th>
      <th className="ColRefusal">{data.notAttributed.refusal}</th>
      <th className="ColUnreachable">{data.notAttributed.unreachable}</th>
      <th className="ColOtherWastes">{data.notAttributed.otherWastes}</th>
      <th className="ColOOS">{data.notAttributed.outOfScope}</th>
      <th className="ColTotalProcessed">{data.notAttributed.totalProcessed}</th>
      <th className="ColumnSpacing" />
      <th className="YellowHeader ColAbsInterviewer">{data.notAttributed.absInterviewer}</th>
      <th className="YellowHeader ColOtherReason">{data.notAttributed.otherReason}</th>
      <th className="YellowHeader ColTotalClosed">{data.notAttributed.totalClosed}</th>
      <th className="ColumnSpacing" />
      <th className="YellowHeader ColAllocated">{data.notAttributed.allocated}</th>
    </tr>
  );

  const totalDemRow = mode !== C.BY_INTERVIEWER_ONE_SURVEY || (
    <tr>
      <th className="ColFirstCol">{D.totalDEM}</th>
      <th className="ColumnSpacing" />
      <th className="YellowHeader ColCollectionRate">
        {Number.isNaN(data.total.dem.collectionRate) || (
          <>
            {(data.total.dem.collectionRate * 100).toFixed(1)}
            %
          </>
        )}
      </th>
      <th className="YellowHeader ColWasteRate">
        {Number.isNaN(data.total.dem.wasteRate) || (
          <>
            {(data.total.dem.wasteRate * 100).toFixed(1)}
            %
          </>
        )}
      </th>
      <th className="YellowHeader ColOOSRate">
        {Number.isNaN(data.total.dem.outOfScopeRate) || (
          <>
            {(data.total.dem.outOfScopeRate * 100).toFixed(1)}
            %
          </>
        )}
      </th>
      <th className="ColumnSpacing" />
      <th className="ColSurveyAcepted">{data.total.dem.surveysAccepted}</th>
      <th className="ColRefusal">{data.total.dem.refusal}</th>
      <th className="ColUnreachable">{data.total.dem.unreachable}</th>
      <th className="ColOtherWastes">{data.total.dem.otherWastes}</th>
      <th className="ColOOS">{data.total.dem.outOfScope}</th>
      <th className="ColTotalProcessed">{data.total.dem.totalProcessed}</th>
      <th className="ColumnSpacing" />
      <th className="YellowHeader ColAbsInterviewer">{data.total.dem.absInterviewer}</th>
      <th className="YellowHeader ColOtherReason">{data.total.dem.otherReason}</th>
      <th className="YellowHeader ColTotalClosed">{data.total.dem.totalClosed}</th>
      <th className="ColumnSpacing" />
      <th className="YellowHeader ColAllocated">{data.total.dem.allocated}</th>
    </tr>
  );

  const tableFooter = (mode !== C.BY_INTERVIEWER_ONE_SURVEY && mode !== C.BY_SITE) || (
    <tfoot>
      {notAttributedRow}
      {totalDemRow}
      <tr>
        <th className="ColFirstCol">{D.totalFrance}</th>
        <th className="ColumnSpacing" />
        <th className="YellowHeader ColCollectionRate">
          {Number.isNaN(data.total.france.collectionRate) || (
            <>
              {(data.total.france.collectionRate * 100).toFixed(1)}
              %
            </>
          )}
        </th>
        <th className="YellowHeader ColWasteRate">
          {Number.isNaN(data.total.france.wasteRate) || (
            <>
              {(data.total.france.wasteRate * 100).toFixed(1)}
              %
            </>
          )}
        </th>
        <th className="YellowHeader ColOOSRate">
          {Number.isNaN(data.total.france.outOfScopeRate) || (
            <>
              {(data.total.france.outOfScopeRate * 100).toFixed(1)}
              %
            </>
          )}
        </th>
        <th className="ColumnSpacing" />
        <th className="ColSurveyAcepted">{data.total.france.surveysAccepted}</th>
        <th className="ColRefusal">{data.total.france.refusal}</th>
        <th className="ColUnreachable">{data.total.france.unreachable}</th>
        <th className="ColOtherWastes">{data.total.france.otherWastes}</th>
        <th className="ColOOS">{data.total.france.outOfScope}</th>
        <th className="ColTotalProcessed">{data.total.france.totalProcessed}</th>
        <th className="ColumnSpacing" />
        <th className="YellowHeader ColAbsInterviewer">{data.total.france.absInterviewer}</th>
        <th className="YellowHeader ColOtherReason">{data.total.france.otherReason}</th>
        <th className="YellowHeader ColTotalClosed">{data.total.france.totalClosed}</th>
        <th className="ColumnSpacing" />
        <th className="YellowHeader ColAllocated">{data.total.france.allocated}</th>
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
          <th className="EmptyHeader ColCollectionRate" />
          <th className="EmptyHeader ColWasteRate" />
          <th className="EmptyHeader ColOOSRate" />
          <th rowSpan="2" className="ColumnSpacing" />
          <th colSpan="6" className="CenteredText">{D.surveyUnitsProcessedInterviewer}</th>
          <th rowSpan="2" className="ColumnSpacing" />
          <th colSpan="3" className="CenteredText">{D.surveyUnitsClosedManagement}</th>
          <th rowSpan="2" className="ColumnSpacing" />
          <th className="EmptyHeader" />
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
            className="YellowHeader Clickable ColCollectionRate"
            onClick={handleSortFunct('collectionRate')}
          >
            {D.collectionRate}
            <SortIcon val="collectionRate" sort={sort} />
          </th>
          <th
            onClick={handleSortFunct('wasteRate')}
            className="YellowHeader Clickable ColWasteRate"
          >
            {D.wasteRate}
            <SortIcon val="wasteRate" sort={sort} />
          </th>
          <th
            onClick={handleSortFunct('outOfScopeRate')}
            className="YellowHeader Clickable ColOOSRate"
          >
            {D.outOfScopeRate}
            <SortIcon val="outOfScopeRate" sort={sort} />
          </th>
          <th
            onClick={handleSortFunct('surveysAccepted')}
            className="Clickable ColSurveyAccepted"
          >
            {D.surveysAccepted}
            <SortIcon val="surveysAccepted" sort={sort} />
          </th>
          <th
            onClick={handleSortFunct('refusal')}
            className="Clickable ColRefusal"
          >
            {D.refusal}
            <SortIcon val="refusal" sort={sort} />
          </th>
          <th
            onClick={handleSortFunct('unreachable')}
            className="Clickable ColUnreachable"
          >
            {D.unreachable}
            <SortIcon val="unreachable" sort={sort} />
          </th>
          <th
            onClick={handleSortFunct('otherWastes')}
            className="Clickable ColOtherWastes"
          >
            {D.otherWastes}
            <SortIcon val="otherWastes" sort={sort} />
          </th>
          <th
            className="Clickable ColOOS"
            onClick={handleSortFunct('outOfScope')}
          >
            {D.outOfScope}
            <SortIcon val="outOfScope" sort={sort} />
          </th>
          <th
            className="Clickable ColTotalProcessed"
            onClick={handleSortFunct('totalProcessed')}
          >
            {D.totalProcessed}
            <SortIcon val="totalProcessed" sort={sort} />
          </th>
          <th
            className="Clickable ColAbsInterviewer"
            onClick={handleSortFunct('absInterviewer')}
          >
            {D.absInterviewer}
            <SortIcon val="absInterviewer" sort={sort} />
          </th>
          <th
            className="Clickable ColOtherReason"
            onClick={handleSortFunct('otherReason')}
          >
            {D.otherReason}
            <SortIcon val="otherReason" sort={sort} />
          </th>
          <th
            className="Clickable ColTotalClosed"
            onClick={handleSortFunct('totalClosed')}
          >
            {D.totalClosed}
            <SortIcon val="totalClosed" sort={sort} />
          </th>
          <th
            className="Clickable ColAllocated"
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
            <CollectionTableDisplayLine
              key={line.id || line.interviewerId || line.survey || line.site}
              data={line}
            />
          ))}
      </tbody>
      {tableFooter}
    </Table>
  );
}

export default CollectionTableDisplay;
