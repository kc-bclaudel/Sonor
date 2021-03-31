import React from 'react';

function CollectionTableDisplayLine({ data }) {
  const {
    interviewerFirstName,
    interviewerLastName,
    survey,
    site,
    collectionRate,
    wasteRate,
    outOfScopeRate,
    surveysAccepted,
    refusal,
    unreachable,
    otherWastes,
    outOfScope,
    totalProcessed,
    absInterviewer,
    otherReason,
    totalClosed,
    allocated,
  } = data;
  const interviewerName = interviewerFirstName
    ? `${interviewerLastName} ${interviewerFirstName}`
    : null;
  return (
    <tr>
      <td>{interviewerName || survey || site}</td>
      <td className="ColumnSpacing" />
      <td>
        {(collectionRate * 100).toFixed(1)}
        %
      </td>
      <td>
        {(wasteRate * 100).toFixed(1)}
        %
      </td>
      <td>
        {(outOfScopeRate * 100).toFixed(1)}
        %
      </td>
      <td className="ColumnSpacing" />
      <td>{surveysAccepted}</td>
      <td>{refusal}</td>
      <td>{unreachable}</td>
      <td>{otherWastes}</td>
      <td>{outOfScope}</td>
      <td>{totalProcessed}</td>
      <td className="ColumnSpacing" />
      <td>{absInterviewer}</td>
      <td>{otherReason}</td>
      <td>{totalClosed}</td>
      <td className="ColumnSpacing" />
      <td>{allocated}</td>
    </tr>
  );
}

export default CollectionTableDisplayLine;
