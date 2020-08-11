import React from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import SortIcon from '../SortIcon/SortIcon';
import Utils from '../../utils/Utils';
import PaginationNav from '../PaginationNav/PaginationNav';
import D from '../../i18n';

class MainScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      pagination: { size: 5, page: 1 },
      sort: { sortOn: null, asc: null },
    };
  }

  componentDidMount() {
    const { preferences, dataRetreiver } = this.props;
    dataRetreiver.getDataForMainScreen(null, (data) => {
      this.setState({
        data: data.filter(
          (survey) => (preferences[survey.id] && preferences[survey.id].preference),
        ),
      }, () => { this.handleSort('label', true); });
    });
  }

  handlePageChange(pagination) {
    this.setState({ pagination });
  }

  handleSort(property, asc) {
    const { data, sort } = this.state;
    const [sortedData, newSort] = Utils.handleSort(property, data, sort, 'mainScreen', asc);
    this.setState({ data: sortedData, sort: newSort });
  }

  render() {
    const handleSort = (property) => this.handleSort(property);
    const { pagination, data, sort } = this.state;
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
                <th colSpan="6">{D.surveyUnits}</th>
              </tr>
              <tr>
                <th onClick={handleSortFunct('allocated')} className="Clickable">
                  <SortIcon val="allocated" sort={sort} />
                  {D.allocated}
                </th>
                <th onClick={handleSortFunct('toProcessInterviewer')} className="Clickable">
                  <SortIcon val="toProcessInterviewer" sort={sort} />
                  {D.toTreatInterviewer}
                </th>
                <th onClick={handleSortFunct('toAffect')} className="Clickable">
                  <SortIcon val="toAffect" sort={sort} />
                  {D.toBeAssigned}
                </th>
                <th onClick={handleSortFunct('toFollowUp')} className="Clickable">
                  <SortIcon val="toFollowUp" sort={sort} />
                  {D.toRemind}
                </th>
                <th onClick={handleSortFunct('toReview')} className="Clickable">
                  <SortIcon val="toReview" sort={sort} />
                  {D.toBeReviewed}
                </th>
                <th onClick={handleSortFunct('finalized')} className="Clickable">
                  <SortIcon val="finalized" sort={sort} />
                  {D.terminated}
                </th>
              </tr>
            </thead>
            <tbody>
              {data
                .slice(
                  (pagination.page - 1) * pagination.size,
                  Math.min(pagination.page * pagination.size, data.length),
                )
                .map((line) => (<SurveyListLine key={line.id} lineData={line} allData={data} />))}
            </tbody>
          </Table>
          <div className="tableOptionsWrapper">
            <PaginationNav.PageSelector
              pagination={pagination}
              updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
              numberOfItems={data.length}
            />
          </div>
        </Card>
      </div>
    );
  }
}

function SurveyListLine({ lineData, allData }) {
  const data = lineData;
  const survey = {
    id: data.id,
    label: data.label,
    visibilityStartDate: data.visibilityStartDate,
    treatmentEndDate: data.treatmentEndDate,
    allSurveys: allData,
  };

  const listSU = { pathname: `/listSU/${data.id}`, survey };
  const review = { pathname: `/review/${data.id}`, survey };
  const followUp = { pathname: `/followUp/${data.id}`, survey };
  const monitoringTable = { pathname: `/follow/campaign/${data.id}`, survey };
  const monitoringTablebySite = { pathname: `/follow/sites/${data.id}`, survey };
  const terminated = { pathname: `/terminated/${data.id}`, survey };

  const portal = {
    pathname: `/portal/${data.id}`,
    surveyInfos: { survey, surveyInfo: data },
  };

  return (
    <tr>
      <td>
        <Link to={monitoringTablebySite} className="TableLink">
          {data.label}
        </Link>
      </td>
      <td className="ColumnSpacing" />
      <td>
        <Link to={portal} className="TableLink">
          {Utils.convertToDateString(data.collectionStartDate)}
        </Link>
      </td>
      <td>
        <Link to={portal} className="TableLink">
          {Utils.convertToDateString(data.collectionEndDate)}
        </Link>
      </td>
      <td>
        <Link to={portal} className="TableLink">
          {Utils.convertToDateString(data.treatmentEndDate)}
        </Link>
      </td>
      <td className="ColumnSpacing" />
      <td>
        <Link to={portal} className="TableLink">
          {Utils.displayCampaignPhase(data.phase)}
        </Link>
      </td>
      <td className="ColumnSpacing" />
      <td>
        <Link to={listSU} className="TableLink">
          {data.allocated}
        </Link>
      </td>
      <td>
        <Link to={monitoringTable} className="TableLink">
          {data.toProcessInterviewer}
        </Link>
      </td>
      <td>{data.toAffect}</td>
      <td>
        <Link to={followUp} className="TableLink">
          {data.toFollowUp}
        </Link>
      </td>
      <td>
        <Link to={review} className="TableLink">
          {data.toReview}
        </Link>
      </td>
      <td>
        <Link to={terminated} className="TableLink">
          {data.finalized}
        </Link>
      </td>
    </tr>
  );
}

export default MainScreen;
