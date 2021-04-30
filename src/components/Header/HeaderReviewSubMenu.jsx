import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import D from '../../i18n';
import './Header.css';

function HeaderReviewSubMenu({ toggle, setModal }) {
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
    <ul ref={elmRef} className="dropdown-menu larger-sub-menu">
      <li>
        <Link
          to="/review"
          className="selectedSubeMenu"
          data-testid="review-link"
          onClick={() => toggle(false)}
        >
          {D.unitsOfSite}
        </Link>
      </li>
      <li>
        <button
          type="button"
          className="selectedSubeMenu"
          onClick={() => setModal(D.unitsOfCampaign, 'review')}
          tabIndex={0}
        >
          {D.unitsOfCampaign}
        </button>
      </li>
    </ul>
  );
}

export default HeaderReviewSubMenu;
