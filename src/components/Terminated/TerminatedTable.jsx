import React from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PaginationNav from '../PaginationNav/PaginationNav';
import SearchField from '../SearchField/SearchField';
import Utils from '../../utils/Utils';
import SortIcon from '../SortIcon/SortIcon';
import D from '../../i18n';

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
    dataRetreiver.getStatesSurvey(newStateTitle, (data) => {
      this.setState({
        toggleStateHistory: true,
        stateId: newStateTitle,
        stateData: data,
      });
    });
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

  surveyListLine(key, lineData) {
    const data = lineData;
    return (
      <tr key={key}>
        <td className="Clickable" data-testid="campaign-label">{data.id}</td>
        <td className="Clickable">{data.campaignLabel}</td>
        <td className="Clickable">{data.interviewer.lastName} {data.interviewer.firstName}</td>
        <td className="Clickable">
          <i className="fa fa-pencil" aria-hidden="true" onClick={() => { window.open('', '_blank'); }} />
          <span />
          <i className="fa fa-history" aria-hidden="true" style={{'padding-left': '5px'}} onClick={(e) => { this.toggleStateHistoryTable(e, data.id);}} />
        </td>
      </tr>
    );
  }

  displayStateHistoryTable(toggle, lineData) {
    if (toggle) {
      return (
        <div style={{'width': '-webkit-fill-available'}}>
          <Card.Title>
            <i class="fa fa-times fa-sm Clickable" onClick={() => { this.hideStateHistoryTable(); }} />
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
                {lineData.map((data) => (
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
    return null;
  }

  render() {
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
}

export default TerminatedTable;
