import React from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Utils from '../../utils/Utils';
import D from '../../i18n';

function displayStateHistoryTable(stateData, stateId, hideStateHistoryTable) {
  return (
    <div id="StateHistoryTableContainer">
      <Card.Title>
        <i
          className="fa fa-times fa-sm Clickable"
          role="button"
          data-testid="close-history"
          tabIndex={0}
          onClick={() => { hideStateHistoryTable(); }}
        />
        {`${D.titleStateSu}${stateId}`}
      </Card.Title>
      <Table id="SurveyList" className="CustomTable" bordered striped hover responsive size="sm">
        <thead>
          <tr>
            <th rowSpan="2">
              {D.stateSuDate}
            </th>
            <th rowSpan="2">
              {D.stateSuHour}
            </th>
            <th rowSpan="2">
              {D.stateSuState}
            </th>
          </tr>
        </thead>
        <tbody>
          {stateData.map((data) => (
            <tr key={data.id}>
              <td className="Clickable" data-testid="campaign-label">{Utils.convertToDateString(data.date)}</td>
              <td className="Clickable">{Utils.convertMsToHoursMinutes(data.date)}</td>
              <td className="Clickable">{data.type}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
export default displayStateHistoryTable;
