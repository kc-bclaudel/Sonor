import React from 'react';

function ProvisionalStatusTableDisplayLine({ data }) {
  const {
    interviewerFirstName,
    interviewerLastName,
    survey,
    npiCount,
    npaCount,
    total,
    allocated,
  } = data;
  const interviewerName = interviewerFirstName
    ? `${interviewerLastName} ${interviewerFirstName}`
    : null;
  return (
    <tr>
      <td>{interviewerName || survey}</td>
      <td className="ColumnSpacing" />
      <td>{npaCount}</td>
      <td>{npiCount}</td>
      <td>{total}</td>
      <td className="ColumnSpacing" />
      <td>{allocated}</td>
    </tr>
  );
}

export default ProvisionalStatusTableDisplayLine;
