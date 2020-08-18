import React from 'react';

function FollowUpTableLine({ data }) {
  const {
    interviewerFirstName,
    interviewerLastName,
    survey,
    site,
    completionRate,
    total,
    notStarted,
    onGoing,
    waitingForIntValidation,
    intValidated,
    demValidated,
    preparingContact,
    atLeastOneContact,
    appointmentTaken,
    interviewStarted,
  } = data;
  const interviewerName = interviewerFirstName
    ? `${interviewerLastName} ${interviewerFirstName}`
    : null;
  return (
    <tr>
      <td>{interviewerName || survey || site}</td>
      <td className="ColumnSpacing" />
      <td>
        {(Math.round(completionRate * 1000) / 1000) * 100}
        %
      </td>
      <td className="ColumnSpacing" />
      <td>{total}</td>
      <td>{notStarted}</td>
      <td>{onGoing}</td>
      <td>{waitingForIntValidation}</td>
      <td>{intValidated}</td>
      <td>{demValidated}</td>
      <td className="ColumnSpacing" />
      <td>{preparingContact}</td>
      <td>{atLeastOneContact}</td>
      <td>{appointmentTaken}</td>
      <td>{interviewStarted}</td>
    </tr>
  );
}

export default FollowUpTableLine;
