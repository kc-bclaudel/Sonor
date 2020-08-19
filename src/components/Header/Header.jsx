import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useLocation } from 'react-router-dom';
import logo from './logo_com_externe_semi_bold.png';
import UserZone from './UserZone';
import D from '../../i18n';
import { version } from '../../../package.json';

import './Header.css';

function Header({
  user, showPreferences,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { pathname } = useLocation();

  return (
    <header id="App-header" className="shadow">
      <Container fluid>
        <Row>
          <Col md="auto">
            <Link to="/" className="ButtonLink">
              <img
                src={logo}
                id="InseeLogo"
                alt="logo"
              />
              <div id="appVersion">
                {version}
              </div>
            </Link>
          </Col>
          <Col>
            <div className="d-inline-flex classTest" id="headerButtonContainer">
              <Link to="/followUp" className="ButtonLink">
                <Button
                  className={`HeaderButton HeaderFocusableButton ${pathname.includes('/followUp') ? ' ButtonActive' : ''}`}
                >
                  {D.remind}
                </Button>
              </Link>
              <li className="dropdown" id="BtnSuivreParent">
                <Button
                  id="FollowButton"
                  className={`HeaderButton HeaderFocusableButton dropdown-toggle ${pathname.includes('/follow/') ? ' ButtonActive' : ''}`}
                  data-toggle="dropdown"
                  onClick={() => { setShowDropdown(!showDropdown); }}
                >
                  {D.follow}
                  <b className="caret" />
                </Button>
                {!showDropdown || displayFirstSubMenu(setShowDropdown)}
              </li>
              <Link to="/review" className="ButtonLink">
                <Button
                  className={`HeaderButton HeaderFocusableButton ${pathname.includes('/review') ? ' ButtonActive' : ''}`}
                >
                  {D.read}
                </Button>
              </Link>
            </div>
          </Col>
          <Col><UserZone user={user} date={new Date()} showPreferences={showPreferences} /></Col>
        </Row>
      </Container>
    </header>
  );
}

function displayFirstSubMenu(toggle) {
  return (
    <ul className="dropdown-menu" onClick={() => toggle(false)}>
      <li>
        <span className="selectedSubeMenu">
          {D.surveys}
          <i className="fa fa-caret-right fa-xs subMenucaret" />
        </span>
        <ul className="dropdown-menu sub-menu">
          <li>
            <Link to="/follow/campaigns" className="selectedSubeMenu">
              {D.progression}
            </Link>
          </li>
        </ul>
      </li>
      <li>
        <span id="selectedSubeMenu" className="selectedSubeMenu">
          {D.interviewers}
          <i className="fa fa-caret-right fa-xs subMenucaret" />
        </span>
        <ul className="dropdown-menu sub-menu" id="SecondDropdown">
          <li>
            <Link to="/follow/interviewers" className="selectedSubeMenu">
              {D.progression}
            </Link>
          </li>
        </ul>
      </li>
    </ul>
  );
}

export default Header;
