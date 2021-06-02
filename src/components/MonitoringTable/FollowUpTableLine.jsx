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
      <td className="ColFirstCol">{interviewerName || survey || site}</td>
      <td className="ColumnSpacing" />
      <td className="ColCompletionRate">
        {Number.isNaN(completionRate) || (
          <>
            {(completionRate * 100).toFixed(1)}
            %
          </>
        )}
      </td>
      <td className="ColumnSpacing" />
      <td className="ColAllocated">{total}</td>
      <td className="ColNotStarted">{notStarted}</td>
      <td className="ColOngoing">{onGoing}</td>
      <td className="ColWaitingForIntVal">{waitingForIntValidation}</td>
      <td className="ColIntVal">{intValidated}</td>
      <td className="ColDemVal">{demValidated}</td>
      <td className="ColumnSpacing" />
      <td className="ColPreparingContact">{preparingContact}</td>
      <td className="ColAtLeastOneContact">{atLeastOneContact}</td>
      <td className="ColAppointmentTaken">{appointmentTaken}</td>
      <td className="ColInterviewStarted">{interviewStarted}</td>
    </tr>
  );
}

export default FollowUpTableLine;
