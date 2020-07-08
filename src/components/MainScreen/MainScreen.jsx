import React from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';

function displaySurveyLines(props) {
  const lines = [];
  let key = 0;
  let oddLine = true;
  props.data.forEach((lineData) => {
    lines.push(<SurveyListLine key={key} oddLine={oddLine} lineData={lineData} props={props} />);
    oddLine = !oddLine;
    key += 1;
  });
  return lines;
}

function MainScreen(props) {
  return (
    <div id="MainScreen">
      <Card className="ViewCard">
        <Card.Title>Liste des enquêtes</Card.Title>
        <Table id="SurveyList" className="CustomTable" bordered striped hover responsive size="sm">
          <thead>
            <tr>
              <th rowSpan="2">Enquête</th>
              <th rowSpan="2" className="ColumnSpacing" />
              <th rowSpan="2">Début collecte</th>
              <th rowSpan="2">Fin collecte </th>
              <th rowSpan="2">Fin traitement</th>
              <th rowSpan="2" className="ColumnSpacing" />
              <th rowSpan="2">Phase</th>
              <th rowSpan="2" className="ColumnSpacing" />
              <th colSpan="4">Unités enquêtées</th>
            </tr>
            <tr>
              <th>Confiées</th>
              <th>À affecter</th>
              <th>En cours</th>
              <th>À contrôler</th>
            </tr>
          </thead>
          <tbody>
            {displaySurveyLines(props)}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

function SurveyListLine({ lineData, oddLine, props }) {
  const data = lineData;
  const lineColor = oddLine ? 'DarkgreyLine' : 'LightGreyLine';
  const goToPortal = () => { props.goToCampaignPortal(data); };
  const goToListSU = () => { props.goToListSU(data.id); };
  const goToMonitoringTable = () => { props.goToMonitoringTable(data.label); };
  return (
    <tr className={lineColor}>
      <td onClick={goToPortal} className="Clickable" data-testid="campaign-label">{data.label}</td>
      <td className="ColumnSpacing" />
      <td onClick={goToPortal} className="Clickable">{data.collectionStartDate}</td>
      <td onClick={goToPortal} className="Clickable">{data.collectionEndDate}</td>
      <td onClick={goToPortal} className="Clickable">{data.treatmentEndDate}</td>
      <td className="ColumnSpacing" />
      <td onClick={goToPortal} className="Clickable">{data.phase}</td>
      <td className="ColumnSpacing" />
      <td onClick={goToListSU} className="Clickable">{data.affected}</td>
      <td>{data.toAffect}</td>
      <td onClick={goToMonitoringTable} className="Clickable">{data.inProgress}</td>
      <td>{data.toControl}</td>
    </tr>
  );
}

export default MainScreen;
