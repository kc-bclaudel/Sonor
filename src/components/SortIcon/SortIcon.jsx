import React from 'react';

function SortIcon({ val, sort }) {
  const ascActive = (val === sort.sortOn && sort.asc) ? 'iconActive' : 'iconInactive';
  const descActive = (val === sort.sortOn && !sort.asc) ? 'iconActive' : 'iconInactive';
  return (
    <span className="sortIcon">
      <i className={`fa fa-fw fa-caret-down sortIconDown ${descActive}`} />
      <i className={`fa fa-fw fa-caret-up sortIconUp ${ascActive}`} />
    </span>
  );
}

export default SortIcon;
