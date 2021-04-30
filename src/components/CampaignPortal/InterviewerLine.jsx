import React from 'react';

function InterviewerLine({ interviewer }) {
  return (
    <tr>
      <td className="LightGreyLine ColInterviewerName">
        {interviewer.interviewerLastName}
        {' '}
        {interviewer.interviewerFirstName}
      </td>
      <td className="LightGreyLine ColIdep">{interviewer.id}</td>
      <td className="LightGreyLine ColUeNb">{interviewer.surveyUnitCount}</td>
    </tr>
  );
}

export default InterviewerLine;
