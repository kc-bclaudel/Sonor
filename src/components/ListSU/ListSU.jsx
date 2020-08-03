import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Col, Row } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import SortIcon from '../SortIcon/SortIcon';
import SearchField from '../SearchField/SearchField';
import PaginationNav from '../PaginationNav/PaginationNav';
import SurveySelector from '../SurveySelector/SurveySelector';
import D from '../../i18n';

function ListSU({
  survey, data, returnToMainScreen, site, sort, handleSort, goToListSU,
}) {
  const surveyTitle = !survey
      || (<div className="SurveyTitle">{survey.label}</div>);
  const surveySelector = !survey
      || (
        <SurveySelector
          survey={survey}
          updateFunc={(newSurvey) => goToListSU(newSurvey)}
        />
      );
  return (
    <div id="ListSU">
      <Row>
        <Col>
          <Button className="YellowButton ReturnButton" onClick={() => returnToMainScreen()} data-testid="return-button">{D.back}</Button>
        </Col>
        <Col xs={6}>
          {surveyTitle}
        </Col>
        <Col>
          {surveySelector}
        </Col>
      </Row>
      <Card className="ViewCard">
        <Card.Title>
          {D.surveyUnitsAllocatedToTheOU}
          {data.surveyUnits.length}
        </Card.Title>
        <SUTable sort={sort} handleSort={handleSort} data={data} survey={survey} site={site} />
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

class SUTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { size: 5, page: 1 },
      displayedLines: props.data.surveyUnits,
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

  updateLines(matchingLines) {
    const { pagination } = this.state;
    this.setState({
      pagination: { size: pagination.size, page: 1 },
      displayedLines: matchingLines,
    });
  }

  render() {
    const { data, sort, handleSort } = this.props;
    const { surveyUnits } = data;
    const fieldsToSearch = ['city', 'interviewer', 'id'];
    const { pagination, displayedLines } = this.state;
    function handleSortFunct(property) { return () => { handleSort(property); }; }
    return (
      <div>
        <Row>
          <Col xs="12" className="text-right">
            <SearchField
              data={surveyUnits}
              searchBy={fieldsToSearch}
              updateFunc={(matchinglines) => this.updateLines(matchinglines)}
            />
          </Col>
          <Col xs="6">
            <PaginationNav.SizeSelector
              updateFunc={(newPagination) => this.handlePageChange(newPagination)}
            />
          </Col>
          <Col xs="6" className="text-right">
            <span>
              {D.result}
              {displayedLines.length}
              /
              {surveyUnits.length}
              &nbsp;
              {D.units}
            </span>
          </Col>
        </Row>
        <Table id="SUTable" className="CustomTable" bordered striped hover responsive size="sm">
          <thead>
            <tr>
              <th onClick={handleSortFunct('id')}>
                {D.identifier}
                <SortIcon val="id" sort={sort} />
              </th>
              <th onClick={handleSortFunct('ssech')}>
                {D.ssech}
                <SortIcon val="ssech" sort={sort} />
              </th>
              <th onClick={handleSortFunct('departement')}>
                {D.department}
                <SortIcon val="departement" sort={sort} />
              </th>
              <th onClick={handleSortFunct('city')}>
                {D.town}
                <SortIcon val="city" sort={sort} />
              </th>
              <th onClick={handleSortFunct('interviewer')}>
                {D.interviewer}
                <SortIcon val="interviewer" sort={sort} />
              </th>
            </tr>
          </thead>
          <tbody>
            {displaySurveyLines(displayedLines, pagination)}
          </tbody>
        </Table>
        <div className="tableOptionsWrapper">
          <Button onClick={() => this.handleExport()}>Export</Button>
          <PaginationNav.PageSelector
            pagination={pagination}
            updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
            numberOfItems={displayedLines.length}
          />
        </div>
      </div>
    );
  }
}

function SurveyUnitLine({ lineData, oddLine }) {
  const {
    id, ssech, departement, city, interviewer,
  } = lineData;
  const lineColor = oddLine ? 'DarkgreyLine' : 'LightGreyLine';
  return (
    <tr className={lineColor}>
      <td>{id}</td>
      <td>{ssech}</td>
      <td>{departement}</td>
      <td>{city}</td>
      <td>{interviewer}</td>
    </tr>
  );
}

export default ListSU;
