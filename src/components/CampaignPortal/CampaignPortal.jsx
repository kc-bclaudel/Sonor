import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function CampaignPortal({ data, returnToMainScreen }) {
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
              <SurveyUnits props={data} />
            </Col>
          </Row>
        </Container>
      </Card>
    </div>
  );
}

function TimeLine({ props }) {
  const { collectionStartDate, collectionEndDate, treatmentEndDate } = props;
  return (
    <div id="TimeLine">
      <div id="PhaseMilestones">
        <div>N/A</div>
        <div className="DateCenter">{collectionStartDate}</div>
        <div className="DateCenter">{collectionEndDate}</div>
        <div className="DateRight">{treatmentEndDate}</div>
      </div>
      <div id="PhaseDisplay">
        <div>Affectation initiale</div>
        <div>Collecte en cours</div>
        <div>Collecte terminée</div>
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

function displayInterviewersLines({ props }) {
  const lines = [];
  props.interviewers.forEach((interviewer) => {
    lines.push(<InterviewerLine key={interviewer.id} interviewer={interviewer} />);
  });
  return lines;
}

function SurveyUnits({ props }) {
  const { notAttributed, total } = props;
  return (
    <Card className="ViewCard">
      <div className="Title">Unités enquêtées</div>
      <Table className="CustomTable" bordered striped hover responsive size="sm">
        <tbody>
          <tr>
            <th>Enquêteur</th>
            <th>Idep</th>
            <th>UE</th>
          </tr>
          {displayInterviewersLines({ props })}
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
    </Card>

  );
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
