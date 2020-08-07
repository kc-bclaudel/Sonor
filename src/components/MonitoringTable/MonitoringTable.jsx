import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, Redirect } from 'react-router-dom';
import PaginationNav from '../PaginationNav/PaginationNav';
import SearchField from '../SearchField/SearchField';
import SurveySelector from '../SurveySelector/SurveySelector';
import SortIcon from '../SortIcon/SortIcon';
import C from '../../utils/constants.json';
import D from '../../i18n';
import Utils from '../../utils/Utils';

class MonitoringTable extends React.Component {
  constructor(props) {
    super(props);
    const mode = Utils.getMonitoringTableModeFromPath(props.location.pathname);
    const { survey } = props.location;
    this.state = {
      pagination: { size: 5, page: 1 },
      displayedLines: [],
      date: null,
      survey,
      mode,
      redirect: !survey && (mode === C.BY_INTERVIEWER_ONE_SURVEY || mode === C.BY_SITE) ? '/' : null,
      loading: true,
    };
  }

  componentDidMount() {
    this.refreshData();
  }

  componentDidUpdate(prevprops) {
    const { location } = this.props;
    if (location.pathname !== prevprops.location.pathname) {
      this.refreshData();
    }
  }

  async refreshData() {
    const { survey, date } = this.state;
    const { dataRetreiver, location } = this.props;
    const dateToUse = date || new Date().toISOString().slice(0, 10);
    const modeToUse = Utils.getMonitoringTableModeFromPath(location.pathname);
    const paginationToUse = { size: 5, page: 1 };
    let surveyToUse;
    if (!survey) {
      surveyToUse = await dataRetreiver.getDataForMainScreen();
    } else {
      surveyToUse = survey.id;
    }
    dataRetreiver.getDataForMonitoringTable(surveyToUse, dateToUse, paginationToUse, modeToUse,
      (res) => {
        const newData = {};
        Object.assign(newData, res);
        newData.date = dateToUse;
        newData.pagination = paginationToUse;
        this.setState({
          date: dateToUse,
          survey,
          displayedLines: newData.interviewersDetail,
          data: newData,
          mode: modeToUse,
          redirect: !survey && (modeToUse === C.BY_INTERVIEWER_ONE_SURVEY || modeToUse === C.BY_SITE) ? '/' : null,
          loading: false,
          sort: { sortOn: null, asc: null },
        }, () => {
          let firstColumnSortAttribute;
          if (modeToUse === C.BY_SURVEY) {
            firstColumnSortAttribute = 'survey';
          } else if (modeToUse === C.BY_SITE) {
            firstColumnSortAttribute = 'site';
          } else {
            firstColumnSortAttribute = 'CPinterviewer';
          }
          this.handleSort(firstColumnSortAttribute, true);
        });
      });
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

  handleExport() {
    const { data, survey, mode } = this.state;
    let fileLabel;
    if (mode === C.BY_SURVEY) {
      fileLabel = `${data.site}_Avancement enquetes`;
    } else if (mode === C.BY_SITE) {
      fileLabel = `${survey.label}_Avancement site`;
    } else {
      fileLabel = `${data.site}_Avancement enqueteurs`;
    }
    const title = `${fileLabel}_${new Date().toLocaleDateString().replace(/\//g, '')}.csv`.replace(/ /g, '_');
    const table = makeTableForExport(data, mode);
    const csvContent = `data:text/csv;charset=utf-8,${table.map((e) => e.join(';')).join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', title);
    document.body.appendChild(link);
    link.click();
  }

  handleSort(property, asc) {
    const { data, sort } = this.state;
    const [sortedData, newSort] = Utils.handleSort(property, data, sort, 'monitoringTable', asc);
    this.setState({ data: sortedData, sort: newSort });
  }

  render() {
    const {
      survey, data, displayedLines, pagination, date, mode, redirect, sort, loading,
    } = this.state;

    if (loading) {
      return [];
    }
    const surveyTitle = !survey || (mode !== C.BY_INTERVIEWER_ONE_SURVEY && mode !== C.BY_SITE)
      || (<div className="SurveyTitle">{survey.label}</div>);
    const surveySelector = !survey || (mode !== C.BY_INTERVIEWER_ONE_SURVEY && mode !== C.BY_SITE)
      || (
        <SurveySelector
          survey={survey}
          updateFunc={(newSurvey) => this.setState({
            survey: newSurvey,
            redirect: {
              pathname: mode === C.BY_SITE
                ? `/follow/sites/${newSurvey.id}`
                : `/follow/${newSurvey.id}`,
              survey: newSurvey,
            },
          })}
        />
      );

    let fieldsToSearch;
    if (mode === C.BY_SURVEY) {
      fieldsToSearch = ['survey'];
    } else if (mode === C.BY_SITE) {
      fieldsToSearch = ['site'];
    } else {
      fieldsToSearch = ['interviewerFirstName', 'interviewerLastName'];
    }

    return redirect
      ? <Redirect to={redirect} />
      : (
        <div id="MonitoringTable">
          <Container fluid>
            <Row>
              <Col>
                <Link to="/" className="ButtonLink">
                  <Button className="YellowButton ReturnButton" data-testid="return-button">{D.back}</Button>
                </Link>
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
                value={date}
                max={new Date().toJSON().split('T')[0]}
                min={survey ? new Date(survey.visibilityStartDate).toJSON().split('T')[0] : null}
                onChange={(e) => this.setState({ date: e.target.value }, () => this.refreshData())}
              />
            </Card.Title>
            <Row>
              <Col xs="6">
                <PaginationNav.SizeSelector
                  updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
                />
              </Col>
              <Col xs="6" className="text-right">
                <SearchField
                  data={data.interviewersDetail}
                  searchBy={fieldsToSearch}
                  updateFunc={
                    (matchingInterviewers) => this.updateInterviewers(matchingInterviewers)
                  }
                />
              </Col>
            </Row>
            <FollowUpTable
              data={data}
              pagination={pagination}
              displayedLines={displayedLines}
              mode={mode}
              handleSort={(property) => this.handleSort(property)}
              sort={sort}
            />
            <div className="tableOptionsWrapper">
              <Button onClick={() => this.handleExport()}>Export</Button>
              <PaginationNav.PageSelector
                pagination={pagination}
                updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
                numberOfItems={displayedLines.length}
              />
            </div>
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
  const totalDemRow = mode !== C.BY_INTERVIEWER_ONE_SURVEY || (
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

  const tableFooter = (mode !== C.BY_INTERVIEWER_ONE_SURVEY && mode !== C.BY_SITE) || (
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

function getHeaderForExport(mode) {
  let firstColumnTitle;
  if (mode === C.BY_SURVEY) {
    firstColumnTitle = D.survey;
  } else if (mode === C.BY_SITE) {
    firstColumnTitle = D.site;
  } else {
    firstColumnTitle = D.interviewer;
  }

  return [
    firstColumnTitle,
    D.completionRate,
    D.allocated,
    D.notStarted,
    D.inProgressInterviewer,
    D.waitingForIntReview,
    D.reviewedByInterviewer,
    D.reviewedEnded,
    D.preparingContact,
    D.atLeastOneContact,
    D.appointmentTaken,
    D.interviewStarted,
  ];
}

function getFooterForExport(data, mode) {
  const footer = [];
  if (mode === C.BY_INTERVIEWER_ONE_SURVEY) {
    footer.push([
      D.totalDEM,
      `${(Math.round(data.total.dem.completionRate * 1000) / 1000) * 100}%`,
      data.total.dem.total,
      data.total.dem.notStarted,
      data.total.dem.onGoing,
      data.total.dem.waitingForIntValidation,
      data.total.dem.intValidated,
      data.total.dem.demValidated,
      data.total.dem.preparingContact,
      data.total.dem.atLeastOneContact,
      data.total.dem.appointmentTaken,
      data.total.dem.interviewStarted,
    ]);
  }
  if (mode === C.BY_INTERVIEWER_ONE_SURVEY || mode === C.BY_SITE) {
    footer.push([
      D.totalFrance,
      `${(Math.round(data.total.france.completionRate * 1000) / 1000) * 100}%`,
      data.total.france.total,
      data.total.france.notStarted,
      data.total.france.onGoing,
      data.total.france.waitingForIntValidation,
      data.total.france.intValidated,
      data.total.france.demValidated,
      data.total.france.preparingContact,
      data.total.france.atLeastOneContact,
      data.total.france.appointmentTaken,
      data.total.france.interviewStarted,
    ]);
  }
  return footer;
}

function getBodyForExport(data) {
  const table = [];
  data.forEach((elm) => {
    const interviewerName = elm.interviewerFirstName
      ? `${elm.interviewerLastName} ${elm.interviewerFirstName}`
      : null;

    const line = [
      interviewerName || elm.survey || elm.site,
      `${(Math.round(elm.completionRate * 1000) / 1000) * 100}%`,
      elm.total,
      elm.notStarted,
      elm.onGoing,
      elm.waitingForIntValidation,
      elm.intValidated,
      elm.demValidated,
      elm.preparingContact,
      elm.atLeastOneContact,
      elm.appointmentTaken,
      elm.interviewStarted,
    ];

    table.push(line);
  });
  return table;
}

function makeTableForExport(data, mode) {
  const table = [];
  const header = getHeaderForExport(mode);
  const body = getBodyForExport(data.interviewersDetail);
  const footer = getFooterForExport(data, mode);

  table.push(header);
  body.forEach((line) => table.push(line));
  footer.forEach((line) => table.push(line));

  return table;
}

export default MonitoringTable;
