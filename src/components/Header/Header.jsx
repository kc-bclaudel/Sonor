import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useLocation } from 'react-router-dom';
import logo from './logo_com_externe_semi_bold.png';
import UserZone from './UserZone';
import HeaderFollowSubMenu from './HeaderFollowSubMenu';
import HeaderReviewSubMenu from './HeaderReviewSubMenu';
import HeaderUsefulInfosSubMenu from './HeaderUsefulInfosSubMenu';

import ModalSelection from '../ModalSelection/ModalSelection';

import D from '../../i18n';
import { version } from '../../../package.json';
import './Header.css';

function Header({
  user, showPreferences, dataRetreiver,
}) {
  const [showFollowDropdown, setShowFollowDropdown] = useState(false);
  const [showReviewDropdown, setShowReviewDropdown] = useState(false);
  const [showUsefulInfosDropdown, setShowUsefulInfosDropdown] = useState(false);

  const [showModalSelect, setShowModalSelect] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalLink, setModalLink] = useState('');
  const [modalInterviewerMode, setModalInterviewerMode] = useState(false);

  const { pathname } = useLocation();

  function setModal(title, linkTo, interviewerMode) {
    setModalInterviewerMode(interviewerMode);
    setShowFollowDropdown(false);
    setShowReviewDropdown(false);
    setShowUsefulInfosDropdown(false);
    setShowModalSelect(true);
    setModalTitle(title);
    setModalLink(linkTo);
  }

  return (
    <header id="App-header" className="shadow">
      <Container fluid>
        <Row>
          <Col id="logoCol" md="auto">
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
              <li className="dropdown" id="BtnSuivreParent">
                <Button
                  id="FollowButton"
                  className={`HeaderButton HeaderFocusableButton dropdown-toggle ${pathname.includes('/follow/') ? ' ButtonActive' : ''}`}
                  data-toggle="dropdown"
                  onClick={() => { setShowFollowDropdown(true); }}
                >
                  {D.follow}
                  <b className="caret" />
                </Button>
                {
                  !showFollowDropdown
                  || (
                    <HeaderFollowSubMenu
                      toggle={(show) => setShowFollowDropdown(show)}
                      setModal={(title, linkTo, intMode) => setModal(title, linkTo, intMode)}
                    />
                  )
                }
              </li>
              <Link to="/followUp" className="ButtonLink">
                <Button
                  data-testid="follow-up"
                  className={`HeaderButton HeaderFocusableButton ${pathname.includes('/followUp') ? ' ButtonActive' : ''}`}
                >
                  {D.remind}
                </Button>
              </Link>
              <li className="dropdown" id="BtnReviewParent">
                <Button
                  data-testid="review"
                  className={`HeaderButton HeaderFocusableButton dropdown-toggle ${pathname.includes('/review') ? ' ButtonActive' : ''}`}
                  onClick={() => { setShowReviewDropdown(true); }}
                >
                  {D.read}
                  <b className="caret" />
                </Button>
                {
                  !showReviewDropdown
                  || (
                    <HeaderReviewSubMenu
                      toggle={(show) => setShowReviewDropdown(show)}
                      setModal={(title, linkTo) => setModal(title, linkTo)}
                    />
                  )
                }
              </li>
              <Link to="/close" className="ButtonLink">
                <Button
                  className={`HeaderButton HeaderFocusableButton ${pathname.includes('/close') ? ' ButtonActive' : ''}`}
                >
                  {D.close2}
                </Button>
              </Link>
            </div>
          </Col>
          <Col>
            <div className="d-inline-flex classTest" id="headerButtonContainer2">
              <li className="dropdown headerRightButton" id="BtnSuivreParent">
                <Link to="/notifications" className="ButtonLink">
                  <Button
                    data-testid="notifications"
                    className={`HeaderButton HeaderFocusableButton ${pathname.includes('/notifications') ? ' ButtonActive' : ''}`}
                  >
                    {D.notify}
                  </Button>
                </Link>
              </li>
              <li className="dropdown headerRightButton" id="BtnSuivreParent">
                <Button
                  className={`HeaderButton HeaderFocusableButton dropdown-toggle ${pathname.includes('/listSU/') || pathname.includes('/portal/') ? ' ButtonActive' : ''}`}
                  data-toggle="dropdown"
                  data-testid="useful-infos-button"
                  onClick={() => { setShowUsefulInfosDropdown(true); }}
                >
                  {D.usefulInformations}
                  <b className="caret" />
                </Button>
                {
                  !showUsefulInfosDropdown
                  || (
                    <HeaderUsefulInfosSubMenu
                      toggle={(show) => setShowUsefulInfosDropdown(show)}
                      setModal={(title, linkTo) => setModal(title, linkTo)}
                    />
                  )
                }
              </li>
            </div>
          </Col>
          <Col>
            <UserZone user={user} date={new Date()} showPreferences={showPreferences} />
          </Col>
        </Row>
      </Container>
      <ModalSelection
        dataRetreiver={dataRetreiver}
        show={showModalSelect}
        setShow={(show) => setShowModalSelect(show)}
        title={modalTitle}
        linkTo={modalLink}
        interviewerMode={modalInterviewerMode}
      />
    </header>
  );
}

export default Header;
