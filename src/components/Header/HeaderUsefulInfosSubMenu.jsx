import React, { useEffect, useRef } from 'react';
import D from '../../i18n';
import './Header.css';

function HeaderUsefulInfosSubMenu({ toggle, setModal }) {
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
        <button
          type="button"
          className="selectedSubeMenu"
          data-testid="campaign-portal-link"
          onClick={() => setModal(D.collectionOrganization, 'portal')}
          tabIndex={0}
        >
          {D.collectionOrganization}
        </button>
      </li>
      <li>
        <button
          type="button"
          className="selectedSubeMenu"
          data-testid="list-su-link"
          onClick={() => setModal(D.unitsAllocatedToSite, 'listSU')}
          tabIndex={0}
        >
          {D.unitsAllocatedToSite}
        </button>
      </li>
    </ul>
  );
}

export default HeaderUsefulInfosSubMenu;
