import React, { useState, useEffect, useCallback }  from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PaginationNav from '../PaginationNav/PaginationNav';
import SurveySelector from '../SurveySelector/SurveySelector';
import SearchField from '../SearchField/SearchField';
import Utils from '../../utils/Utils';
import SortIcon from '../SortIcon/SortIcon';
import D from '../../i18n';
import { Link, Redirect } from 'react-router-dom';

function Terminated({
  location, dataRetreiver, match,
}) {
  const { survey } = location;
  const { id } = match.params;
  const [data, setData] = useState([]);
  const [sort, setSort] = useState({ sortOn: null, asc: null });
  const [redirect, setRedirect] = useState(!survey && id ? '/' : null);

  const fetchData = useCallback(() => {
    let surveyId = null;
    if (survey) surveyId = survey.id;
    dataRetreiver.getListSuTerminated(surveyId, (res) => {
      setData(res);
      setRedirect(null);
    });
  }, [dataRetreiver, survey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleSort(property, asc) {
    const [sortedData, newSort] = Utils.handleSort(property, data, sort, 'terminated', asc);
    setSort(newSort);
    setData(sortedData);
  }

  const surveyTitle = !survey || (<div className="SurveyTitle">{survey.label}</div>);
  const surveySelector = !survey || (
    <SurveySelector
      survey={survey}
      updateFunc={(newSurvey) => setRedirect({ pathname: `/terminated/${newSurvey.id}`, survey: newSurvey })}
    />
  );
  
  return redirect ? <Redirect to={redirect} />
  :(
    <div>
        <Container fluid>
            <Row>
                <Col>
                  <Link to="/" className="ButtonLink">
                    <Button className="YellowButton ReturnButton" data-testid="return-button">{D.back}</Button>
                  </Link>
                </Col>
                <Col xs={6}>
                  {surveyTitle}
                </Col>
                <Col>
                  {surveySelector}
                </Col>
            </Row>
        </Container>
        <Card className="ViewCard">
          <Card.Title>
            {D.titleListSu}
            {data.length}
          </Card.Title>
          <TerminatedTable
            data={data}
            sort={sort}
            survey={survey}
            dataRetreiver={dataRetreiver}
            handleSort={handleSort}
          />
        </Card>
    </div>
  );
}

class TerminatedTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        pagination: { size: 5, page: 1 },
        displayData: props.data,
        toggleStateHistory: false,
        stateData: [],
        stateId: '',
      };
    }

    toggleStateHistoryTable(e, newStateTitle) {
        const { dataRetreiver } = this.props;
        e.stopPropagation();
        dataRetreiver.getStatesSurvey(newStateTitle, (data) => {this.setState({
          toggleStateHistory: true,
          stateId: newStateTitle,
          stateData: data
        })});
    }

    hideStateHistoryTable() {
      this.setState({ toggleStateHistory: false });
    }

    handlePageChange(pagination) {
        this.setState({ pagination });
    }

    updateLines(matchingLines) {
        const { pagination } = this.state;
        this.setState({
          pagination: { size: pagination.size, page: 1 },
          displayData: matchingLines,
        });
      }

    render () {
        const { pagination, displayData, stateData } = this.state;
        const { data, handleSort, sort } = this.props;
        const fieldsToSearch = ['interviewerFirstName', 'interviewerLastName', 'id'];
        function handleSortFunct(property) { return () => { handleSort(property); }; }
        return (
            <div>
              <Row>
                <Col xs="6">
                  <PaginationNav.SizeSelector
                    updateFunc={(newPagination) => this.handlePageChange(newPagination)}
                  />
                </Col>
                <Col xs="6" className="text-right">
                  <SearchField
                    data={data}
                    searchBy={fieldsToSearch}
                    updateFunc={(matchinglines) => this.updateLines(matchinglines)}
                  />
                </Col>
              </Row>
              <div style={{'width': '-webkit-fill-available'}}>
                <Table id="SurveyList" className="CustomTable" bordered striped hover responsive size="sm">
                    <thead>
                        <tr>
                            <th rowSpan="2" onClick={handleSortFunct('id')}>
                            <SortIcon val="id" sort={sort} />
                            {D.identifier}
                            </th>
                            <th rowSpan="2" onClick={handleSortFunct('campaignLabel')}>
                            <SortIcon val="campaignLabel" sort={sort} />
                            {D.survey}
                            </th>
                            <th rowSpan="2" onClick={handleSortFunct('interviewer')}>
                            <SortIcon val="interviewer" sort={sort} />
                            {D.interviewer}
                            </th>
                            <th rowSpan="2">
                            {D.listSuActions}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {displayData
                      .slice(
                        (pagination.page - 1) * pagination.size,
                        Math.min(pagination.page * pagination.size, displayData.length),
                      )
                      .map((line) => (
                        this.surveyListLine(line.id, line)
                      ))}
                    </tbody>
                </Table>
                <div className="tableOptionsWrapper">
                  <PaginationNav.PageSelector
                    pagination={pagination}
                    updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
                    numberOfItems={displayData.length}
                  />
                </div>
              </div>
              {this.displayStateHistoryTable(this.state.toggleStateHistory, stateData)}
            </div>
        );
    }

    surveyListLine(key, lineData) {
        const data = lineData;
        return (
          <tr key={key}>
            <td className="Clickable" data-testid="campaign-label">{data.id}</td>
            <td className="Clickable">{data.campaignLabel}</td>
            <td className="Clickable">{data.interviewer.lastName} {data.interviewer.firstName}</td>
            <td className="Clickable">
              <i className="fa fa-pencil" aria-hidden="true" onClick={() => { window.open('', '_blank'); }}></i><span/>
              <i className="fa fa-history" aria-hidden="true" style={{'padding-left': '5px'}} onClick={(e) => { this.toggleStateHistoryTable(e, data.id);}}></i></td>
          </tr>
        );
      }

      displayStateHistoryTable(toggle, lineData) {
        if (toggle){
          return (
              <div style={{'width': '-webkit-fill-available'}}>
                  <Card.Title>
                    <i class="fa fa-times fa-sm Clickable" onClick={() => { this.hideStateHistoryTable(); }}></i>
                    {D.titleStateSu}{this.state.stateId}
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
                      {lineData.map((line) => (
                        this.displayStatesSurvey(line)
                      ))}
                      </tbody>
                  </Table>
              </div>
            );
        }
        return null;
      }

    displayStatesSurvey(data){
        return(
          <tr key={data.id}>
            <td className="Clickable" data-testid="campaign-label">{Utils.convertToDateString(data.date)}</td>
            <td className="Clickable">{Utils.convertMsToHoursMinutes(data.date)}</td>
            <td className="Clickable">{data.type}</td>
          </tr>
      )
    }
}

export default Terminated;