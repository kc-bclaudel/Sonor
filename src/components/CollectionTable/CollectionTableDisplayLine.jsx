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
      <td className="ColFirstCol">{interviewerName || survey || site}</td>
      <td className="ColumnSpacing" />
      <td className="ColCollectionRate">
        {Number.isNaN(collectionRate) || (
          <>
            {Number.isNaN(collectionRate) ? '' : (collectionRate * 100).toFixed(1)}
            %
          </>
        )}
      </td>
      <td className="ColWasteRate">
        {Number.isNaN(wasteRate) || (
          <>
            {Number.isNaN(wasteRate) ? '' : (wasteRate * 100).toFixed(1)}
            %
          </>
        )}
      </td>
      <td className="ColOOSRate">
        {Number.isNaN(outOfScopeRate) || (
          <>
            {Number.isNaN(outOfScopeRate) ? '' : (outOfScopeRate * 100).toFixed(1)}
            %
          </>
        )}
      </td>
      <td className="ColumnSpacing" />
      <td className="ColSurveyAcepted">{surveysAccepted}</td>
      <td className="ColRefusal">{refusal}</td>
      <td className="ColUnreachable">{unreachable}</td>
      <td className="ColOtherWastes">{otherWastes}</td>
      <td className="ColOOS">{outOfScope}</td>
      <td className="ColTotalProcessed">{totalProcessed}</td>
      <td className="ColumnSpacing" />
      <td className="ColAbsInterviewer">{absInterviewer}</td>
      <td className="ColOtherReason">{otherReason}</td>
      <td className="ColTotalClosed">{totalClosed}</td>
      <td className="ColumnSpacing" />
      <td className="ColAllocated">{allocated}</td>
    </tr>
  );
}

export default CollectionTableDisplayLine;
