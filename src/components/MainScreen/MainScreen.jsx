import React from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import SortIcon from '../SortIcon/SortIcon';
import Utils from '../../utils/Utils';
import PaginationNav from '../PaginationNav/PaginationNav';
import D from '../../i18n';

function displaySurveyLines(props, pagination) {
  const lines = [];
  const { data } = props;
  let oddLine = true;
  for (let i = (pagination.page - 1) * pagination.size;
    i < pagination.page * pagination.size && i < data.length;
    i += 1
  ) {
    lines.push(<SurveyListLine key={i} oddLine={oddLine} lineData={data[i]} props={props} />);
    oddLine = !oddLine;
  }
  return lines;
}

class MainScreen extends React.Component {
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
    const { sort, handleSort, data } = this.props;
    const { pagination } = this.state;
    function handleSortFunct(property) { return () => { handleSort(property); }; }
    return (
      <div id="MainScreen">
        <Card className="ViewCard">
          <Card.Title>{D.surveyList}</Card.Title>
          <PaginationNav.SizeSelector
            updateFunc={(newPagination) => this.handlePageChange(newPagination)}
          />
          <Table id="SurveyList" className="CustomTable" bordered striped hover responsive size="sm">
            <thead>
              <tr>
                <th rowSpan="2" onClick={handleSortFunct('label')}>
                  <SortIcon val="label" sort={sort} />
                  {D.survey}
                </th>
                <th rowSpan="2" className="ColumnSpacing" />
                <th rowSpan="2" onClick={handleSortFunct('collectionStartDate')}>
                  <SortIcon val="collectionStartDate" sort={sort} />
                  {D.collectionStartDate}
                </th>
                <th rowSpan="2" onClick={handleSortFunct('collectionEndDate')}>
                  <SortIcon val="collectionEndDate" sort={sort} />
                  {D.collectionEndDate}
                </th>
                <th rowSpan="2" onClick={handleSortFunct('treatmentEndDate')}>
                  <SortIcon val="treatmentEndDate" sort={sort} />
                  {D.treatmentEndDate}
                </th>
                <th rowSpan="2" className="ColumnSpacing" />
                <th rowSpan="2" onClick={handleSortFunct('phase')} className="Clickable">
                  <SortIcon val="phase" sort={sort} />
                  {D.phase}
                </th>
                <th rowSpan="2" className="ColumnSpacing" />
                <th colSpan="4">{D.surveyUnits}</th>
              </tr>
              <tr>
                <th onClick={handleSortFunct('affected')} className="Clickable">
                  <SortIcon val="affected" sort={sort} />
                  {D.allocated}
                </th>
                <th onClick={handleSortFunct('toAffect')} className="Clickable">
                  <SortIcon val="toAffect" sort={sort} />
                  {D.toBeAssigned}
                </th>
                <th onClick={handleSortFunct('inProgress')} className="Clickable">
                  <SortIcon val="inProgress" sort={sort} />
                  {D.inProgress}
                </th>
                <th onClick={handleSortFunct('toControl')} className="Clickable">
                  <SortIcon val="toControl" sort={sort} />
                  {D.toBeReviewed}
                </th>
              </tr>
            </thead>
            <tbody>
              {displaySurveyLines(this.props, pagination)}
            </tbody>
          </Table>
          <PaginationNav.PageSelector
            pagination={pagination}
            updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
            numberOfItems={data.length}
          />
        </Card>
      </div>
    );
  }
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
      <td onClick={goToPortal} className="Clickable">{Utils.convertToDateString(data.collectionStartDate)}</td>
      <td onClick={goToPortal} className="Clickable">{Utils.convertToDateString(data.collectionEndDate)}</td>
      <td onClick={goToPortal} className="Clickable">{Utils.convertToDateString(data.treatmentEndDate)}</td>
      <td className="ColumnSpacing" />
      <td onClick={goToPortal} className="Clickable">{Utils.displayCampaignPhase(data.phase)}</td>
      <td className="ColumnSpacing" />
      <td onClick={goToListSU} className="Clickable">{data.affected}</td>
      <td>{data.toAffect}</td>
      <td onClick={goToMonitoringTable} className="Clickable">{data.inProgress}</td>
      <td>{data.toControl}</td>
    </tr>
  );
}

export default MainScreen;
