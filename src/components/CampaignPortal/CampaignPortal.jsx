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

function CampaignPortal({
  data, returnToMainScreen, sort, handleSort,
}) {
  return (
    <div id="CampaignPortal">
      <Button className="YellowButton ReturnButton" onClick={() => returnToMainScreen()} data-testid="return-button">Retour</Button>
      <div className="SurveyTitle">{data.label}</div>
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
        <div className={`${phase === 0 ? ' CurrentPhase' : ''}`}>Affectation initiale</div>
        <div className={`${phase === 1 ? ' CurrentPhase' : ''}`}>Collecte en cours</div>
        <div className={`${phase > 1 ? ' CurrentPhase' : ''}`}>Collecte terminée</div>
      </div>
      <div id="PhaseMilestones">
        <div>integration</div>
        <div className="LabelCenter">début de collecte</div>
        <div className="LabelCenter">fin de collecte</div>
        <div className="LabelRight">fin de traitement</div>
      </div>
    </div>
  );
}

function Contacts() {
  return (
    <Card className="ViewCard">
      <div>
        <Card.Title className="Title">Contacts</Card.Title>

        <Table className="CustomTable" bordered striped hover responsive size="sm">
          <tbody>
            <tr>
              <th>Enquête</th>
              <td className="LightGreyLine">gestion-enquete-mobilités</td>
            </tr>
            <tr>
              <th rowSpan="2">CPOS</th>
              <td className="LightGreyLine">Chloé Berlin</td>
            </tr>
            <tr>
              <td className="LightGreyLine">01 87 69 64 53</td>
            </tr>
            <tr>
              <th rowSpan="2">Adjoint CPOS</th>
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

function displayInterviewersLines({ interviewers, pagination }) {
  const lines = [];
  for (let i = (pagination.page - 1) * pagination.size;
    i < pagination.page * pagination.size && i < interviewers.length;
    i += 1
  ) {
    lines.push(<InterviewerLine key={i} interviewer={interviewers[i]} />);
  }
  return lines;
}

class SurveyUnits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { size: 5, page: 1 },
    };
  }

  handlePageChange(pagination) {
    this.setState({ pagination });
  }

  render() {
    const { data, sort, handleSortfunc } = this.props;
    const { notAttributed, total, interviewers } = data;
    const { pagination } = this.state;
    function handleSort(property) { return () => { handleSortfunc(property); }; }
    return (
      <Card className="ViewCard">
        <div className="Title">Unités enquêtées</div>
        <PaginationNav.SizeSelector
          updateFunc={(newPagination) => this.handlePageChange(newPagination)}
        />
        <Table className="CustomTable" bordered striped hover responsive size="sm">
          <tbody>
            <tr>
              <th onClick={handleSort('CPinterviewer')} className="Clickable">
                <SortIcon val="CPinterviewer" sort={sort} />
                Enquêteur
              </th>
              <th onClick={handleSort('CPidep')} className="Clickable">
                <SortIcon val="CPidep" sort={sort} />
                Idep
              </th>
              <th onClick={handleSort('CPue')} className="Clickable">
                <SortIcon val="CPue" sort={sort} />
                UE
              </th>
            </tr>
            {displayInterviewersLines({ interviewers, pagination })}
            <tr>
              <th>Non attribuée(s)</th>
              <th />
              <th>{notAttributed.count}</th>
            </tr>
            <tr>
              <th>Total DEM</th>
              <th />
              <th>{total.DEM.total}</th>
            </tr>
          </tbody>
        </Table>
        <PaginationNav.PageSelector
          pagination={pagination}
          updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
          numberOfItems={interviewers.length}
        />
      </Card>

    );
  }
}

function InterviewerLine({ interviewer }) {
  return (
    <tr>
      <td className="LightGreyLine">
        {interviewer.interviewerFirstName}
        {' '}
        {interviewer.interviewerLastName}
      </td>
      <td className="LightGreyLine">{interviewer.id}</td>
      <td className="LightGreyLine">{interviewer.surveyUnitCount}</td>
    </tr>
  );
}

export default CampaignPortal;
