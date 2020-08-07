import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Col, Row } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { Link, Redirect } from 'react-router-dom';
import SortIcon from '../SortIcon/SortIcon';
import SearchField from '../SearchField/SearchField';
import PaginationNav from '../PaginationNav/PaginationNav';
import SurveySelector from '../SurveySelector/SurveySelector';
import Utils from '../../utils/Utils';
import D from '../../i18n';

function ListSU({
  location, dataRetreiver,
}) {
  const { survey } = location;

  const [data, setData] = useState([]);
  const [site, setSite] = useState('');
  const [sort, setSort] = useState({ sortOn: null, asc: null });
  const [redirect, setRedirect] = useState(!survey ? '/' : null);

  useEffect(() => {
    dataRetreiver.getDataForListSU(!survey || survey.id, (res) => {
      setData(res.surveyUnits);
      setSite(res.site);
      setRedirect(null);
    });
  }, [redirect]);

  function handleSort(property, asc) {
    const [sortedData, newSort] = Utils.handleSort(property, data, sort, 'listSU', asc);
    setSort(newSort);
    setData(sortedData);
  }
  return redirect
    ? <Redirect to={redirect} />
    : (
      <div id="ListSU">
        <Row>
          <Col>
            <Link to="/" className="ButtonLink">
              <Button className="YellowButton ReturnButton" data-testid="return-button">{D.back}</Button>
            </Link>
          </Col>
          <Col xs={6}>
            <div className="SurveyTitle">{survey.label}</div>
          </Col>
          <Col>
            <SurveySelector
              survey={survey}
              updateFunc={(newSurvey) => setRedirect({ pathname: `/listSU/${newSurvey.id}`, survey: newSurvey })}
            />
          </Col>
        </Row>
        <Card className="ViewCard">
          <Card.Title>
            {D.surveyUnitsAllocatedToTheOU}
            {data.length}
          </Card.Title>
          <SUTable sort={sort} handleSort={handleSort} data={data} survey={survey} site={site} />
        </Card>
      </div>
    );
}

function makeTableForExport(data) {
  const header = [[
    D.identifier,
    D.ssech,
    D.department,
    D.town,
    D.interviewer,
    D.idep,
  ]];

  return header.concat(data.map((line) => ([
    line.id,
    line.ssech,
    line.departement,
    line.city,
    line.interviewer,
    line.idep,
  ])));
}

class SUTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { size: 5, page: 1 },
      displayedLines: props.data,
    };
  }

  handlePageChange(pagination) {
    this.setState({ pagination });
  }

  handleExport() {
    const { data, survey, site } = this.props;
    const fileLabel = `${site}_${survey.label}_UE_confiees`;

    const title = `${fileLabel}_${new Date().toLocaleDateString().replace(/\//g, '')}.csv`.replace(/ /g, '_');
    const table = makeTableForExport(data);
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
    const fieldsToSearch = ['city', 'interviewer', 'id'];
    const { pagination, displayedLines } = this.state;
    function handleSortFunct(property) { return () => { handleSort(property); }; }
    return (
      <div>
        <Row>
          <Col xs="12" className="text-right">
            <SearchField
              data={data}
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
              {data.length}
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
            {displayedLines
              .slice(
                (pagination.page - 1) * pagination.size,
                Math.min(pagination.page * pagination.size, displayedLines.length),
              )
              .map((line) => (<SurveyUnitLine key={line.id} lineData={line} />))}
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

function SurveyUnitLine({ lineData }) {
  const {
    id, ssech, departement, city, interviewer,
  } = lineData;
  return (
    <tr>
      <td>{id}</td>
      <td>{ssech}</td>
      <td>{departement}</td>
      <td>{city}</td>
      <td>{interviewer}</td>
    </tr>
  );
}

export default ListSU;
