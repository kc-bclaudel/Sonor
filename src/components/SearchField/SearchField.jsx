import React from 'react';
import D from '../../i18n';

function getMatchingInterviewers(data, firstName, LastName, str) {
  const matchingInterviewers = [];
  const s = str.toLowerCase();
  data.forEach((interviewer) => {
    if ((`${interviewer[firstName]} ${interviewer[LastName]}`).toLowerCase().includes(s)) {
      matchingInterviewers.push(interviewer);
    }
  });
  return matchingInterviewers;
}

function SearchField({
  data, firstName, lastName, updateFunc,
}) {
  return (
    <span className="SearchField">
      <input
        className="SearchFieldInput"
        type="text"
        placeholder={D.search}
        onChange={(e) => updateFunc(getMatchingInterviewers(
          data,
          firstName,
          lastName,
          e.target.value,
        ))}
      />
    </span>
  );
}

export default SearchField;
