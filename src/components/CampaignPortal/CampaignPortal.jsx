import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
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
  survey, data, returnToMainScreen, sort, handleSort, handleCampaignClick,
}) {
  return (
    <div id="CampaignPortal">
      <Container fluid>
        <Row>
          <Col>
            <Button className="YellowButton ReturnButton" onClick={() => returnToMainScreen()} data-testid="return-button">{D.back}</Button>
          </Col>
          <Col xs={6}>
            <div className="SurveyTitle">{data.label}</div>
          </Col>
          <Col>
            <SurveySelector
              survey={survey}
              updateFunc={(newSurvey, index) => handleCampaignClick(
                newSurvey,
                newSurvey.allSurveys[index],
              )}
            />
          </Col>
        </Row>
      </Container>
      <Card className="ViewCard">
        <Container fluid>
          <Row>
            <Col>
              <Card className="ViewCard">
                <TimeLine props={data} />
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Contacts />
            </Col>
            <Col>
              <SurveyUnits data={data} sort={sort} handleSortfunc={handleSort} />
            </Col>
          </Row>
        </Container>
      </Card>
    </div>
  );
}

function TimeLine({ props }) {
  const {
    collectionStartDate, collectionEndDate, treatmentEndDate, phase,
  } = props;
  return (
    <div id="TimeLine">
      <div id="PhaseMilestones">
        <div>N/A</div>
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
  return (
    <Card className="ViewCard">
      <div>
        <Card.Title className="Title">{D.contacts}</Card.Title>

        <Table className="CustomTable" bordered striped hover responsive size="sm">
          <tbody>
            <tr>
              <th>{D.survey}</th>
              <td className="LightGreyLine">gestion-enquete-mobilités</td>
            </tr>
            <tr>
              <th rowSpan="2">{D.cpos}</th>
              <td className="LightGreyLine">Chloé Berlin</td>
            </tr>
            <tr>
              <td className="LightGreyLine">01 87 69 64 53</td>
            </tr>
            <tr>
              <th rowSpan="2">{D.deputyCpos}</th>
              <td className="LightGreyLine">Thierry Fabres</td>
            </tr>
            <tr>
              <td className="LightGreyLine">06 23 55 88 22</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Card>
  );
}

function displayInterviewersLines({ displayedInterviewers, pagination }) {
  const lines = [];
  for (let i = (pagination.page - 1) * pagination.size;
    i < pagination.page * pagination.size && i < displayedInterviewers.length;
    i += 1
  ) {
    lines.push(<InterviewerLine key={i} interviewer={displayedInterviewers[i]} />);
  }
  return lines;
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

  render() {
    const { data, sort, handleSortfunc } = this.props;
    const { notAttributed, total, interviewers } = data;
    const { pagination, displayedInterviewers } = this.state;
    function handleSort(property) { return () => { handleSortfunc(property); }; }
    return (
      <Card className="ViewCard">
        <div className="Title">{D.surveyUnits}</div>
        <div id="searchParametersContainerCP">
          <PaginationNav.SizeSelector
            updateFunc={(newPagination) => this.handlePageChange(newPagination)}
          />
          <SearchField
            data={interviewers}
            searchBy={['interviewerFirstName', 'interviewerLastName']}
            updateFunc={(a) => this.updateInterviewers(a)}
          />
        </div>
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
            {displayInterviewersLines({ displayedInterviewers, pagination })}
            <tr>
              <th>{D.unassigned}</th>
              <th />
              <th>{notAttributed.count}</th>
            </tr>
            <tr>
              <th>{D.totalDEM}</th>
              <th />
              <th>{total.total}</th>
            </tr>
          </tbody>
        </Table>
        <PaginationNav.PageSelector
          pagination={pagination}
          updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
          numberOfItems={displayedInterviewers.length}
        />
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

export default CampaignPortal;
