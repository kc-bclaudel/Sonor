import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SurveySelector from '../SurveySelector/SurveySelector';
import D from '../../i18n';

function Remind({
  location,
}) {
  const [survey, setSurvey] = useState(location.survey);
  const surveyTitle = !survey
      || (<div className="SurveyTitle">{survey.label}</div>);
  const surveySelector = !survey
      || (
        <SurveySelector
          survey={survey}
          updateFunc={(newSurvey) => setSurvey(newSurvey)}
        />
      );
  return (
    <div id="Remind">
      <Container fluid>
        <Row>
          <Col>
            <Link to="/" className="ButtonLink ReturnButtonLink">
              <Button className="ReturnButton" data-testid="return-button">{D.back}</Button>
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
        <Card.Title className="PageTitle">
          {D.developmentInProgress}
        </Card.Title>
      </Card>
    </div>
  );
}

export default Remind;
