import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import D from '../../i18n';
import './Header.css';

function HeaderFollowSubMenu({ toggle, setModal }) {
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          toggle(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }

  const elmRef = useRef(null);
  useOutsideAlerter(elmRef);

  return (
    <ul ref={elmRef} className="dropdown-menu">
      <li>
        <span className="selectedSubeMenu">
          {D.site}
          <i className="fa fa-caret-right fa-xs subMenucaret" />
        </span>
        <ul className="dropdown-menu sub-menu">
          <li>
            <Link
              to="/follow/campaigns"
              className="selectedSubeMenu"
              data-testid="follow-by-survey"
              onClick={() => toggle(false)}
            >
              {D.progression}
            </Link>
          </li>
          <li>
            <Link
              to="/collection/campaigns"
              className="selectedSubeMenu"
              data-testid="follow-by-survey"
              onClick={() => toggle(false)}
            >
              {D.collection}
            </Link>
          </li>
        </ul>
      </li>
      <li>
        <span className="selectedSubeMenu">
          {D.survey}
          <i className="fa fa-caret-right fa-xs subMenucaret" />
        </span>
        <ul className="dropdown-menu sub-menu secondDropdownRow">
          <li>
            <span className="selectedSubeMenu">
              {D.table}
              <i className="fa fa-caret-right fa-xs subMenucaret" />
            </span>
            <ul className="dropdown-menu sub-menu-level-2 larger-sub-menu">
              <li>
                <button
                  type="button"
                  className="selectedSubeMenu"
                  onClick={() => setModal(D.progressBySite, 'follow/sites')}
                  tabIndex={0}
                >
                  {D.progressBySite}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="selectedSubeMenu"
                  onClick={() => setModal(D.progressByInterviewer, 'follow/campaign')}
                  tabIndex={0}
                >
                  {D.progressByInterviewer}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="selectedSubeMenu"
                  onClick={() => setModal(D.collectionBySite, 'collection/sites')}
                  tabIndex={0}
                >
                  {D.collectionBySite}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="selectedSubeMenu"
                  onClick={() => setModal(D.collectionByInterviewer, 'collection/campaign')}
                  tabIndex={0}
                >
                  {D.collectionByInterviewer}
                </button>
              </li>
              <li>
                <Link
                  to="/"
                  className="selectedSubeMenu"
                  data-testid="follow-by-survey"
                  onClick={() => toggle(false)}
                >
                  {D.unitsToAffect}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="selectedSubeMenu"
                  onClick={() => setModal(D.unitsDone, 'terminated')}
                  tabIndex={0}
                >
                  {D.unitsDone}
                </button>
              </li>
            </ul>
          </li>
          <li>
            <span className="selectedSubeMenu">
              {D.graph}
              <i className="fa fa-caret-right fa-xs subMenucaret" />
            </span>
            <ul className="dropdown-menu sub-menu-level-2 larger-sub-menu secondDropdownRow">
              <li>
                <Link
                  to="/"
                  className="selectedSubeMenu"
                  data-testid="follow-by-survey"
                  onClick={() => toggle(false)}
                >
                  {D.siteProgress}
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="selectedSubeMenu"
                  data-testid="follow-by-survey"
                  onClick={() => toggle(false)}
                >
                  {D.siteCollection}
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <span id="selectedSubeMenu" className="selectedSubeMenu">
          {D.interviewer}
          <i className="fa fa-caret-right fa-xs subMenucaret" />
        </span>
        <ul className="dropdown-menu sub-menu thirdDropdownRow">
          <li>
            <span className="selectedSubeMenu">
              {D.table}
              <i className="fa fa-caret-right fa-xs subMenucaret" />
            </span>
            <ul className="dropdown-menu sub-menu-level-2 larger-sub-menu">
              <li>
                <button
                  type="button"
                  className="selectedSubeMenu"
                  onClick={() => setModal(D.progressBySurvey, 'follow/campaigns/interviewer', true)}
                  tabIndex={0}
                >
                  {D.progressBySurvey}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="selectedSubeMenu"
                  onClick={() => setModal(D.collectionBySurvey, 'collection/campaigns/interviewer', true)}
                  tabIndex={0}
                >
                  {D.collectionBySurvey}
                </button>
              </li>
            </ul>
          </li>
          <li>
            <span className="selectedSubeMenu">
              {D.graph}
              <i className="fa fa-caret-right fa-xs subMenucaret" />
            </span>
            <ul className="dropdown-menu sub-menu-level-2 secondDropdownRow">
              <li>
                <Link
                  to="/"
                  className="selectedSubeMenu"
                  data-testid="follow-by-survey"
                  onClick={() => toggle(false)}
                >
                  {D.progression}
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="selectedSubeMenu"
                  data-testid="follow-by-survey"
                  onClick={() => toggle(false)}
                >
                  {D.collection}
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  );
}

export default HeaderFollowSubMenu;
