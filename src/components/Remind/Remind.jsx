import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SurveySelector from '../SurveySelector/SurveySelector';
import D from '../../i18n';

function Remind({
  survey, returnToMainScreen, goToRemind,
}) {
  const surveyTitle = !survey
      || (<div className="SurveyTitle">{survey.label}</div>);
  const surveySelector = !survey
      || (
        <SurveySelector
          survey={survey}
          updateFunc={(newSurvey) => goToRemind(newSurvey)}
        />
      );
  return (
    <div id="Remind">
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
          {D.developmentInProgress}
        </Card.Title>
      </Card>
    </div>
  );
}

export default Remind;
