import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import logo from './logo_com_externe_semi_bold.png';

function Header({ user }) {
  return (
    <header id="App-header" className="shadow">
      <Container fluid>
        <Row>
          <Col md="auto">
            <img src={logo} id="InseeLogo" alt="logo" />
          </Col>
          <Col>
            <div id="headerButtonContainer">
              <Button className="HeaderButton YellowHeaderButton">Affecter</Button>
              <Button className="HeaderButton YellowHeaderButton">Suivre</Button>
              <Button className="HeaderButton YellowHeaderButton">Contrôler</Button>
            </div>
          </Col>
          <Col><UserZone user={user} date={new Date()} /></Col>
        </Row>
      </Container>
    </header>
  );
}

function UserZone({ user, date }) {
  return (
    <Card id="UserZone">
      <Card.Title>
        { 'Bienvenue '}
        {user.firstname}
        &nbsp;
        {user.lastname}
      </Card.Title>
      <Card.Subtitle className="mb-2 text-muted">{date.toLocaleDateString()}</Card.Subtitle>
      <div className="UserZoneButtons">
        <Button className="HeaderButton">Mes enquêteurs</Button>
        <Button className="HeaderButton">Mes enquêtes</Button>
      </div>
    </Card>
  );
}

export default Header;
