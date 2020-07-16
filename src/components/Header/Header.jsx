import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import logo from './logo_com_externe_semi_bold.png';
import D from '../../i18n';
import { version } from '../../../package.json';
import './Header.css';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleFirstMenu: false,
      toggleSecondMenu: false,
    };
  }

  toggleFirstDropDownMenu(e) {
    const { toggleFirstMenu } = this.state;
    e.stopPropagation();
    this.setState({ toggleFirstMenu: !toggleFirstMenu });
  }

  toggleSecondDropDownMenu(e) {
    const { toggleSecondMenu } = this.state;
    e.stopPropagation();
    this.setState({ toggleSecondMenu: !toggleSecondMenu });
  }

  displayFirstSubMenu(toggle) {
    const { toggleSecondMenu } = this.state;
    if (toggle) {
      return (
        <ul className="dropdown-menu">
          <li>
            <a onClick={(e) => { this.toggleSecondDropDownMenu(e); }} className="selectedSubeMenu" href="#">
              {D.surveys}
              <i style={{ marginLeft: '40px' }} className="fa fa-caret-right fa-xs" />
            </a>
            {this.displaySecondSubMenu(toggleSecondMenu)}
          </li>
          <li>
            <a onClick={(e) => { this.toggleSecondDropDownMenu(e); }} id="selectedSubeMenu" className="selectedSubeMenu" href="#">
              {D.interviewers}
              <i style={{ marginLeft: '25px' }} className="fa fa-caret-right fa-xs" />
            </a>
            {this.displaySecondSubMenu(toggleSecondMenu)}
          </li>
        </ul>
      );
    }
    return null;
  }

  displaySecondSubMenu(toggle) {
    const { goToMonitoringTable } = this.props;
    if (toggle) {
      return (
        <ul className="dropdown-menu sub-menu" id="BtnSuivre">
          <li>
            <a onClick={() => goToMonitoringTable()} className="selectedSubeMenu" href="#">{D.progression}</a>
          </li>
        </ul>
      );
    }
    return null;
  }

  hideMenu() {
    this.setState({
      toggleFirstMenu: false,
      toggleSecondMenu: false,
    });
  }

  render() {
    const {
      returnFunc, user,
    } = this.props;
    const { toggleFirstMenu } = this.state;
    return (
      <header id="App-header" className="shadow">
        <Container fluid>
          <Row onClick={() => { this.hideMenu(); }}>
            <Col md="auto">
              <img
                src={logo}
                id="InseeLogo"
                alt="logo"
                className="Clickable"
                onClick={() => returnFunc()}
              />
              <div style={{
                textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', color: '#575453',
              }}
              >
                {version}
              </div>
            </Col>
            <Col>
              <div className="d-inline-flex classTest" id="headerButtonContainer">
                <Button className="HeaderButton">{D.dun}</Button>
                <li className="dropdown" id="BtnSuivreParent">
                  <Button data-toggle="dropdown" className="HeaderButton dropdown-toggle" href="#" onClick={(e) => { this.toggleFirstDropDownMenu(e); }}>
                    {D.follow}
                    <b className="caret" />
                  </Button>
                  {this.displayFirstSubMenu(toggleFirstMenu)}
                </li>
                <Button className="HeaderButton">{D.read}</Button>
              </div>
            </Col>
            <Col><UserZone user={user} date={new Date()} /></Col>
          </Row>
        </Container>
      </header>
    );
  }
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
        <Button className="HeaderButton">{D.myInterviewers}</Button>
        <Button className="HeaderButton">{D.mySurveys}</Button>
      </div>
    </Card>
  );
}

export default Header;
