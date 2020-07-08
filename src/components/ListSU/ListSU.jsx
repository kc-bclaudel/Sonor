import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

function ListSU({ survey, data, returnToMainScreen }) {
  return (
    <div id="ListSU">
      <Button className="YellowButton ReturnButton" onClick={() => returnToMainScreen()}>Retour</Button>
      <div className="SurveyTitle">{survey}</div>
      <Card className="ViewCard">
        <Card.Title>
          {'Unitées enquêtées confiées à la DEM: '}
          {108}
        </Card.Title>
        <SUTable data={data} />
      </Card>
    </div>
  );
}

function displaySurveyLines({ data }) {
  const lines = [];
  let key = 0;
  let oddLine = true;
  data.forEach((lineData) => {
    lines.push(<SurveyUnitLine key={key} oddLine={oddLine} lineData={lineData} />);
    oddLine = !oddLine;
    key += 1;
  });
  return lines;
}

function SUTable({ data }) {
  return (
    <Table id="SUTable" className="CustomTable" bordered striped hover responsive size="sm">
      <thead>
        <tr>
          <th>Identifiant</th>
          <th>Ssech</th>
          <th>Département</th>
          <th>Commune</th>
          <th>Enquêteur</th>
          <th>Idep</th>
        </tr>
      </thead>
      <tbody>
        {displaySurveyLines({ data })}
      </tbody>
    </Table>
  );
}

function SurveyUnitLine({ lineData, oddLine }) {
  const {
    id, ssech, departement, city, interviewer, idep,
  } = lineData;
  const lineColor = oddLine ? 'DarkgreyLine' : 'LightGreyLine';
  return (
    <tr className={lineColor}>
      <td>{id}</td>
      <td>{ssech}</td>
      <td>{departement}</td>
      <td>{city}</td>
      <td>{interviewer}</td>
      <td>{idep}</td>
    </tr>
  );
}

export default ListSU;
