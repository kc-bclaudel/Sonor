import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import D from '../../i18n';

function UserZone({ user, date, showPreferences }) {
  return (
    <Card id="UserZone">
      <Card.Title>
        { 'Bienvenue '}
        {user.firstName}
        &nbsp;
        {user.lastName}
      </Card.Title>
      <Card.Subtitle className="mb-2 text-muted">{date.toLocaleDateString()}</Card.Subtitle>
      <div className="UserZoneButtons">
        <Row>
          <Col xs="8">
            <Button
              variant="outline-primary"
              className="HeaderButton"
              data-testid="preferences"
              onClick={() => showPreferences()}
            >
              {D.mySurveys}
            </Button>
          </Col>
          <Col xs="4">
            <div
              className="HeaderDocLink Clickable"
              onClick={() => window.open('', '_blank')}
              role="link"
              tabIndex="0"
            >
              <i className="fa fa-question-circle-o fa-2x" />
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );
}

export default UserZone;
