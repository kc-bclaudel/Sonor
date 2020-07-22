import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PaginationNav from '../PaginationNav/PaginationNav';
import SearchField from '../SearchField/SearchField';
import SurveySelector from '../SurveySelector/SurveySelector';
import SortIcon from '../SortIcon/SortIcon';
import { BY_INTERVIEWER_ONE_SURVEY, BY_SURVEY, BY_SITE } from '../../utils/constants.json';
import D from '../../i18n';

class MonitoringTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { size: 5, page: 1 },
      displayedLines: props.data.interviewersDetail,
    };
  }

  handlePageChange(pagination) {
    this.setState({ pagination });
  }

  updateInterviewers(matchingLines) {
    const { pagination } = this.state;
    this.setState({
      pagination: { size: pagination.size, page: 1 },
      displayedLines: matchingLines,
    });
  }

  render() {
    const {
      survey, data, sort, returnToMainScreen, goToMonitoringTable, mode, handleSort,
    } = this.props;
    const { displayedLines, pagination } = this.state;
    const surveyTitle = (mode !== BY_INTERVIEWER_ONE_SURVEY && mode !== BY_SITE)
      || (<div className="SurveyTitle">{survey.label}</div>);
    const surveySelector = (mode !== BY_INTERVIEWER_ONE_SURVEY && mode !== BY_SITE)
      || (
        <SurveySelector
          survey={survey}
          updateFunc={(newSurvey) => goToMonitoringTable(
            newSurvey,
            data.date,
            mode,
          )}
        />
      );

    let fieldsToSearch;
    if (mode === BY_SURVEY) {
      fieldsToSearch = ['survey'];
    } else if (mode === BY_SITE) {
      fieldsToSearch = ['site'];
    } else {
      fieldsToSearch = ['interviewerFirstName', 'interviewerLastName'];
    }
    return (
      <div id="MonitoringTable">
        <Container fluid>
          <Row>
            <Col>
              <Button className="YellowButton ReturnButton" onClick={() => returnToMainScreen()} data-testid="return-button">{D.back}</Button>
            </Col>
            <Col xs={6}>
              {surveyTitle}
            </Col>
            <Col>
              {surveySelector}
            </Col>
          </Row>
        </Container>
        <Card className="ViewCard">
          <Card.Title>
            <div className="DateDisplay">{D.monitoringTableIntroductionSentence}</div>
            <input
              id="datePicker"
              className="DateDisplay"
              type="date"
              value={data.date}
              onChange={(e) => goToMonitoringTable(
                survey,
                e.target.value,
                mode,
              )}
            />
          </Card.Title>
          <div id="searchParametersContainer">

            <PaginationNav.SizeSelector
              updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
            />
            <SearchField
              data={data.interviewersDetail}
              searchBy={fieldsToSearch}
              updateFunc={(matchingInterviewers) => this.updateInterviewers(matchingInterviewers)}
            />
          </div>
          <FollowUpTable
            data={data}
            pagination={pagination}
            displayedLines={displayedLines}
            mode={mode}
            handleSort={handleSort}
            sort={sort}
          />
          <PaginationNav.PageSelector
            pagination={pagination}
            updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
            numberOfItems={displayedLines.length}
          />
        </Card>
      </div>
    );
  }
}

function displayFollowUpTableLines(interviewersDetail, pagination) {
  const lines = [];
  let oddLine = true;
  for (let i = (pagination.page - 1) * pagination.size;
    i < pagination.page * pagination.size && i < interviewersDetail.length;
    i += 1
  ) {
    lines.push(<FollowUpTableLine key={i} oddLine={oddLine} data={interviewersDetail[i]} />);
    oddLine = !oddLine;
  }
  return lines;
}

function FollowUpTable({
  data, sort, displayedLines, pagination, mode, handleSort,
}) {
  const totalDemRow = mode !== BY_INTERVIEWER_ONE_SURVEY || (
    <tr>
      <th>{D.totalDEM}</th>
      <th className="ColumnSpacing" />
      <th className="YellowHeader">
        {(Math.round(data.total.dem.completionRate * 1000) / 1000) * 100}
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

  const tableFooter = (mode !== BY_INTERVIEWER_ONE_SURVEY && mode !== BY_SITE) || (
    <tfoot>
      {totalDemRow}
      <tr>
        <th>{D.totalFrance}</th>
        <th className="ColumnSpacing" />
        <th className="YellowHeader">
          {(Math.round(data.total.france.completionRate * 1000) / 1000) * 100}
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
  if (mode === BY_SURVEY) {
    firstColumnTitle = D.survey;
    firstColumnSortAttribute = 'survey';
  } else if (mode === BY_SITE) {
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
            {D.inProgress}
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
            {D.reviewedByDEM}
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
        {displayFollowUpTableLines(displayedLines, pagination)}
      </tbody>
      {tableFooter}
    </Table>
  );
}

function FollowUpTableLine({ data, oddLine }) {
  const {
    interviewerFirstName,
    interviewerLastName,
    survey,
    site,
    completionRate,
    total,
    notStarted,
    onGoing,
    waitingForIntValidation,
    intValidated,
    demValidated,
    preparingContact,
    atLeastOneContact,
    appointmentTaken,
    interviewStarted,
  } = data;
  const interviewerName = interviewerFirstName
    ? `${interviewerLastName} ${interviewerFirstName}`
    : null;
  const lineColor = oddLine ? 'DarkgreyLine' : 'LightGreyLine';
  return (
    <tr className={lineColor}>
      <td>{interviewerName || survey || site}</td>
      <td className="ColumnSpacing" />
      <td>
        {(Math.round(completionRate * 1000) / 1000) * 100}
        %
      </td>
      <td className="ColumnSpacing" />
      <td>{total}</td>
      <td>{notStarted}</td>
      <td>{onGoing}</td>
      <td>{waitingForIntValidation}</td>
      <td>{intValidated}</td>
      <td>{demValidated}</td>
      <td className="ColumnSpacing" />
      <td>{preparingContact}</td>
      <td>{atLeastOneContact}</td>
      <td>{appointmentTaken}</td>
      <td>{interviewStarted}</td>
    </tr>
  );
}

export default MonitoringTable;
