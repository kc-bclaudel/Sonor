import React from 'react';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import displayStateHistoryTable from './DisplayStateHistoryTable';
import PaginationNav from '../PaginationNav/PaginationNav';
import SearchField from '../SearchField/SearchField';
import SortIcon from '../SortIcon/SortIcon';
import Utils from '../../utils/Utils';
import D from '../../i18n';

class TerminatedTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { size: 10, page: 1 },
      displayData: props.data,
      toggleStateHistory: false,
      stateData: [],
      stateId: '',
    };
    this.queenUrl = `${window.localStorage.getItem('QUEEN_URL_FRONT_END')}`;
  }

  getMaxWidth(){
    return [document.getElementById("stateHistoryDate").getBoundingClientRect().width, 
              document.getElementById("stateHistoryHour").getBoundingClientRect().width,
              document.getElementById("stateHistoryState").getBoundingClientRect().width]    
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

  surveyListLine(data, survey) {
    return (
      <tr key={data.id}>
        <td className="Clickable" data-testid="campaign-label">{data.id}</td>
        <td className="Clickable">{survey.label}</td>
        <td className="Clickable">{`${data.interviewer.interviewerLastName} ${data.interviewer.interviewerFirstName}`}</td>
        <td className="Clickable">{Utils.convertToDateString(data.finalizationDate) + " " + Utils.convertMsToHoursMinutes(data.finalizationDate)}</td>
        <td className="Clickable">
          <i
            className="fa fa-pencil EditLink"
            aria-hidden="true"
            onClick={() => { window.open(`${this.queenUrl}/queen/readonly/questionnaire/${survey.id}/survey-unit/${data.id}`); }}
          />
          <span />
          <i className="fa fa-history HistoryDisplayIcon" aria-hidden="true" onClick={(e) => { this.toggleStateHistoryTable(e, data.id); }} />
        </td>
      </tr>
    );
  }

  render() {
    const {
      pagination, displayData, stateData, toggleStateHistory, stateId,
    } = this.state;
    const {
      data, survey, handleSort, sort,
    } = this.props;
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
        <div id="TerminatedTableContainer">
          <Table id="SurveyList" className="CustomTable" bordered striped hover responsive size="sm">
            <thead>
              <tr>
                <th
                  id="stateHistoryDate"
                  data-testid="TableHeader_id_terminated"
                  rowSpan="2"
                  onClick={handleSortFunct('id')}
                >
                  <SortIcon val="id" sort={sort} />
                  {D.identifier}
                </th>
                <th
                  id="stateHistoryHour"
                  rowSpan="2" 
                  onClick={handleSortFunct('campaignLabel')}>
                  <SortIcon val="campaignLabel" sort={sort} />
                  {D.survey}
                </th>
                <th
                  id="stateHistoryState"
                  rowSpan="2"
                  onClick={handleSortFunct('interviewer_terminated')}
                >
                  <SortIcon val="interviewer_terminated" sort={sort} />
                  {D.interviewer}
                </th>
                <th 
                  rowSpan="2"
                  onClick={handleSortFunct('finalizationDate')}
                >
                  <SortIcon val="finalizationDate" sort={sort} />
                  {D.finalizedDate}
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
                  this.surveyListLine(line, survey)
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
        {!toggleStateHistory
        || displayStateHistoryTable(stateData, stateId, (() => this.hideStateHistoryTable()), (() => this.getMaxWidth()))}
      </div>
    );
  }
}

export default TerminatedTable;
