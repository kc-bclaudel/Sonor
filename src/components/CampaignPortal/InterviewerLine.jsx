import React from 'react';

function InterviewerLine({ interviewer }) {
  return (
    <tr>
      <td className="LightGreyLine">
        {interviewer.interviewerLastName}
        {' '}
        {interviewer.interviewerFirstName}
      </td>
      <td className="LightGreyLine">{interviewer.id}</td>
      <td className="LightGreyLine">{interviewer.surveyUnitCount}</td>
    </tr>
  );
}

export default InterviewerLine;
