import React from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Utils from '../../utils/Utils';
import D from '../../i18n';

function displayStateHistoryTable(stateData, stateId, hideStateHistoryTable, maxWidth) {
  return (
    <div id="StateHistoryTableContainer">
      <Card.Title className="PageTitle">
        <i
          className="fa fa-times fa-sm Clickable HistoryTableCross"
          role="button"
          data-testid="close-history"
          tabIndex={0}
          onClick={() => { hideStateHistoryTable(); }}
        />
        {`${D.titleStateSu}${stateId}`}
      </Card.Title>
      <Table id="SurveyList" className="CustomTable" bordered striped hover responsive size="sm" style={{maxWidth:maxWidth()[0] + maxWidth()[1] + maxWidth()[2]}}>
        <thead>
          <tr>
            <th rowSpan="2" style={{width:maxWidth()[0]}}>
              {D.stateSuDate}
            </th>
            <th rowSpan="2" style={{width:maxWidth()[1]}}>
              {D.stateSuHour}
            </th>
            <th rowSpan="2" style={{width:maxWidth()[2]}}>
              {D.stateSuState}
            </th>
          </tr>
        </thead>
        <tbody>
          {stateData.map((data) => (
            <tr key={data.id}>
              <td data-testid="campaign-label">{Utils.convertToDateString(data.date)}</td>
              <td>{Utils.convertMsToHoursMinutes(data.date)}</td>
              <td>{data.type ? D[data.type] : ''}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
export default displayStateHistoryTable;
