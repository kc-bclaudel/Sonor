import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import PaginationNav from '../PaginationNav/PaginationNav';
import D from '../../i18n';

function ListSU({
  survey, data, returnToMainScreen, site,
}) {
  return (
    <div id="ListSU">
      <Button className="YellowButton ReturnButton" onClick={() => returnToMainScreen()}>{D.back}</Button>
      <div className="SurveyTitle">{survey.label}</div>
      <Card className="ViewCard">
        <Card.Title>
          {D.surveyUnitsAllocatedToTheDEM}
          {108}
        </Card.Title>
        <SUTable data={data} survey={survey} site={site} />
      </Card>
    </div>
  );
}

function displaySurveyLines(data, pagination) {
  const lines = [];
  let oddLine = true;
  for (let i = (pagination.page - 1) * pagination.size;
    i < pagination.page * pagination.size && i < data.length;
    i += 1
  ) {
    lines.push(<SurveyUnitLine key={i} oddLine={oddLine} lineData={data[i]} />);
    oddLine = !oddLine;
  }

  return lines;
}

class SUTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { size: 5, page: 1 },
    };
  }

  handlePageChange(pagination) {
    this.setState({ pagination });
  }

  handleExport() {
    const { data, survey } = this.props;
    const fileLabel = `${data.site}_${survey.label}_UE_confiees`;

    const title = `${fileLabel}_${new Date().toLocaleDateString().replace(/\//g, '')}.csv`;
    const table = makeTableForExport(data.surveyUnits);
    const csvContent = `data:text/csv;charset=utf-8,${table.map((e) => e.join(';')).join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', title);
    document.body.appendChild(link);
    link.click();
  }

  render() {
    const { data } = this.props;
    const { pagination } = this.state;
    return (
      <div>
        <PaginationNav.SizeSelector
          updateFunc={(newPagination) => this.handlePageChange(newPagination)}
        />
        <Table id="SUTable" className="CustomTable" bordered striped hover responsive size="sm">
          <thead>
            <tr>
              <th>{D.identifier}</th>
              <th>{D.ssech}</th>
              <th>{D.department}</th>
              <th>{D.town}</th>
              <th>{D.interviewer}</th>
              <th>{D.idep}</th>
            </tr>
          </thead>
          <tbody>
            {displaySurveyLines( data.surveyUnits, pagination )}
          </tbody>
        </Table>
        <div className="tableOptionsWrapper">
          <Button onClick={() => this.handleExport()}>Export</Button>
          <PaginationNav.PageSelector
            pagination={pagination}
            updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
            numberOfItems={data.surveyUnits.length}
          />
        </div>
      </div>
    );
  }
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

function makeTableForExport(data) {
  const table = [];
  const header = [
    D.identifier,
    D.ssech,
    D.department,
    D.town,
    D.interviewer,
    D.idep,
  ];

  table.push(header);
  data.forEach((line) => {
    table.push([
      line.id,
      line.ssech,
      line.departement,
      line.city,
      line.interviewer,
      line.idep,
    ]);
  });

  return table;
}

export default ListSU;
