import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import PaginationNav from '../PaginationNav/PaginationNav';
import D from '../../i18n';

function ListSU({ survey, data, returnToMainScreen }) {
  return (
    <div id="ListSU">
      <Button className="YellowButton ReturnButton" onClick={() => returnToMainScreen()}>{D.back}</Button>
      <div className="SurveyTitle">{survey.label}</div>
      <Card className="ViewCard">
        <Card.Title>
          {D.surveyUnitsAllocatedToTheDEM}
          {108}
        </Card.Title>
        <SUTable data={data} />
      </Card>
    </div>
  );
}

function displaySurveyLines({ data, pagination }) {
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
            {displaySurveyLines({ data, pagination })}
          </tbody>
        </Table>
        <div className="tableOptionsWrapper">
          <PaginationNav.PageSelector
            pagination={pagination}
            updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
            numberOfItems={data.length}
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

export default ListSU;
