import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link, Redirect } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Utils from '../../utils/Utils';
import SortIcon from '../SortIcon/SortIcon';
import PaginationNav from '../PaginationNav/PaginationNav';
import SearchField from '../SearchField/SearchField';
import SurveySelector from '../SurveySelector/SurveySelector';
import D from '../../i18n';

function CampaignPortal({
  location, dataRetreiver,
}) {
  const initialData = {};
  initialData.interviewers = [];
  initialData.displayedInterviewers = [];
  initialData.notAttributed = { count: null };
  initialData.abandoned = { count: null };
  initialData.total = { total: null };
  const survey = location.surveyInfos ? location.surveyInfos.survey : null;
  const surveyInfo = location.surveyInfos ? location.surveyInfos.surveyInfo : null;

  const [data, setData] = useState(initialData);
  const [sort, setSort] = useState({ sortOn: null, asc: null });
  const [redirect, setRedirect] = useState(!survey ? '/' : null);

  useEffect(() => {
    dataRetreiver.getDataForCampaignPortal(!survey || survey.id, (res) => {
      setData(res);
      setRedirect(null);
    });
  }, [redirect, dataRetreiver, survey]);

  function handleSort(property, asc) {
    const [sortedData, newSort] = Utils.handleSort(property, data, sort, 'campaignPortal', asc);
    setSort(newSort);
    setData(sortedData);
  }

  return redirect
    ? <Redirect to={redirect} />
    : (
      <div id="CampaignPortal">
        <Container fluid>
          <Row>
            <Col>
              <Link to="/" className="ButtonLink">
                <Button className="YellowButton ReturnButton" data-testid="return-button">{D.back}</Button>
              </Link>
            </Col>
            <Col xs={6}>
              <div className="SurveyTitle">{survey.label}</div>
            </Col>
            <Col>
              <SurveySelector
                survey={survey}
                updateFunc={(newSurvey, index) => setRedirect({
                  pathname: `/portal/${newSurvey.id}`,
                  surveyInfos: { survey: newSurvey, surveyInfo: newSurvey.allSurveys[index] },
                })}
              />
            </Col>
          </Row>
        </Container>
        <Card className="ViewCard">
          <Container fluid>
            <Row>
              <Col>
                <Card className="ViewCard">
                  <TimeLine props={surveyInfo} />
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Contacts />
              </Col>
              <Col>
                <SurveyUnits data={data} survey={survey} sort={sort} handleSortfunc={handleSort} />
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    );
}

function TimeLine({ props }) {
  const {
    visibilityStartDate, collectionStartDate, collectionEndDate, treatmentEndDate, phase,
  } = props;
  return (
    <div id="TimeLine">
      <div id="PhaseMilestones">
        <div>{Utils.convertToDateString(visibilityStartDate)}</div>
        <div className="DateCenter">{Utils.convertToDateString(collectionStartDate)}</div>
        <div className="DateCenter">{Utils.convertToDateString(collectionEndDate)}</div>
        <div className="DateRight">{Utils.convertToDateString(treatmentEndDate)}</div>
      </div>
      <div id="PhaseDisplay">
        <div className={`${phase === 0 ? ' CurrentPhase' : ''}`}>{D.initialAssignment}</div>
        <div className={`${phase === 1 ? ' CurrentPhase' : ''}`}>{D.collectionInProgress}</div>
        <div className={`${phase > 1 ? ' CurrentPhase' : ''}`}>{D.collectionOver}</div>
      </div>
      <div id="PhaseMilestones">
        <div>{D.integration}</div>
        <div className="LabelCenter">{D.startOfCollection}</div>
        <div className="LabelCenter">{D.endOfCollection}</div>
        <div className="LabelRight">{D.endOfTreatment}</div>
      </div>
    </div>
  );
}

function Contacts() {
  const renderTooltip = (
    <Popover id="popover-basic">
      <Popover.Content>
        {D.sendMail}
      </Popover.Content>
    </Popover>
  );
  return (
    <Card className="ViewCard">
      <div>
        <Card.Title className="Title">{D.contacts}</Card.Title>

        <Table className="CustomTable" bordered striped responsive size="sm">
          <tbody>
            <OverlayTrigger placement="top" overlay={renderTooltip}>
              <tr className="Clickable" onClick={() => { window.location = 'mailto:survey@mail.com'; }}>
                <th>{D.functionalBox}</th>
                <td className=" LightGreyLine">survey@mail.com</td>
              </tr>
            </OverlayTrigger>
            <tr>
              <th rowSpan="2">{D.cpos}</th>
              <td className="LightGreyLine">Chloé Dupont</td>
            </tr>
            <tr>
              <td className="LightGreyLine">01 01 01 01 01</td>
            </tr>
            <tr>
              <th rowSpan="2">{D.deputyCpos}</th>
              <td className="LightGreyLine">Thierry Fabres</td>
            </tr>
            <tr>
              <td className="LightGreyLine">02 01 01 01 01</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Card>
  );
}

class SurveyUnits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { size: 5, page: 1 },
      displayedInterviewers: props.data.interviewers,
    };
  }

  handlePageChange(pagination) {
    this.setState({ pagination });
  }

  updateInterviewers(matchingInterviewers) {
    const { pagination } = this.state;
    this.setState({
      pagination: { size: pagination.size, page: 1 },
      displayedInterviewers: matchingInterviewers,
    });
  }

  handleExport() {
    const { data, survey } = this.props;
    const fileLabel = `${data.site}_${survey.label}_Repartition enqueteurs`;

    const title = `${fileLabel}_${new Date().toLocaleDateString().replace(/\//g, '')}.csv`.replace(/ /g, '_');
    const table = makeTableForExport(data);
    const csvContent = `data:text/csv;charset=utf-8,${table.map((e) => e.join(';')).join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', title);
    document.body.appendChild(link);
    link.click();
  }

  render() {
    const { data, sort, handleSortfunc } = this.props;
    const {
      abandoned, notAttributed, total, interviewers,
    } = data;
    const { pagination, displayedInterviewers } = this.state;
    const fieldsToSearch = ['interviewerFirstName', 'interviewerLastName'];
    function handleSort(property) { return () => { handleSortfunc(property); }; }
    return (
      <Card className="ViewCard">
        <div className="Title">{D.interviewers}</div>
        <Row>
          <Col xs="6">
            <PaginationNav.SizeSelector
              updateFunc={(newPagination) => this.handlePageChange(newPagination)}
            />
          </Col>
          <Col xs="6" className="text-right">
            <SearchField
              data={interviewers}
              searchBy={fieldsToSearch}
              updateFunc={(a) => this.updateInterviewers(a)}
            />
          </Col>
        </Row>
        <Table className="CustomTable" bordered striped hover responsive size="sm">
          <tbody>
            <tr>
              <th onClick={handleSort('CPinterviewer')} className="Clickable">
                <SortIcon val="CPinterviewer" sort={sort} />
                {D.interviewer}
              </th>
              <th onClick={handleSort('CPidep')} className="Clickable">
                <SortIcon val="CPidep" sort={sort} />
                {D.idep}
              </th>
              <th onClick={handleSort('CPue')} className="Clickable">
                <SortIcon val="CPue" sort={sort} />
                {D.SU}
              </th>
            </tr>
            {displayedInterviewers
              .slice(
                (pagination.page - 1) * pagination.size,
                Math.min(pagination.page * pagination.size, displayedInterviewers.length),
              )
              .map((line) => (<InterviewerLine key={line.id} interviewer={line} />))}
            <tr>
              <th>{D.unassigned}</th>
              <th />
              <th>{notAttributed.count}</th>
            </tr>
            <tr>
              <th>{D.abandoned}</th>
              <th />
              <th>{abandoned.count}</th>
            </tr>
            <tr>
              <th>{D.totalDEM}</th>
              <th />
              <th>{total.total}</th>
            </tr>
          </tbody>
        </Table>
        <div className="tableOptionsWrapper">
          <Button onClick={() => this.handleExport()}>Export</Button>
          <PaginationNav.PageSelector
            pagination={pagination}
            updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
            numberOfItems={displayedInterviewers.length}
          />
        </div>
      </Card>

    );
  }
}

function InterviewerLine({ interviewer }) {
  return (
    <tr>
      <td className="LightGreyLine">
        {interviewer.interviewerLastName}
        {' '}
        {interviewer.interviewerFirstName}
      </td>
      <td className="LightGreyLine">{interviewer.id}</td>
      <td className="LightGreyLine">{interviewer.surveyUnitCount}</td>
    </tr>
  );
}

function makeTableForExport(data) {
  const {
    abandoned, notAttributed, total, interviewers,
  } = data;

  const header = [[
    D.interviewer,
    D.idep,
    D.SU,
  ]];

  const footer = [
    [
      D.unassigned,
      ' ',
      notAttributed.count,
    ],
    [
      D.abandoned,
      ' ',
      abandoned.count,
    ],
    [
      D.totalDEM,
      ' ',
      total.total,
    ],
  ];

  return header.concat(
    interviewers.map((line) => ([
      `${line.interviewerLastName} ${line.interviewerFirstName}`,
      line.id,
      line.surveyUnitCount,
    ])),
    footer,
  );
}

export default CampaignPortal;
