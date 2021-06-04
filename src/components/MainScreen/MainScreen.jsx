import React from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import SortIcon from '../SortIcon/SortIcon';
import Utils from '../../utils/Utils';
import SurveyListLine from './SurveyListLine';
import PaginationNav from '../PaginationNav/PaginationNav';
import D from '../../i18n';
import './MainScreen.css';

class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: { size: 10, page: 1 },
      sort: { sortOn: null, asc: null },
      isLoading: true,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    const { preferences } = this.props;
    const { isLoading } = this.state;
    if (prevProps.preferences !== preferences && !isLoading) {
      this.fetchData();
    }
  }

  fetchData() {
    const { preferences, dataRetreiver } = this.props;
    this.setState({ isLoading: true });
    dataRetreiver.getDataForMainScreen(null, (data) => {
      this.setState({
        isLoading: false,
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
    const { loadingPreferences } = this.props;
    const {
      pagination, data, sort, isLoading,
    } = this.state;
    function handleSortFunct(property) { return () => { handleSort(property); }; }
    return (
      <div id="MainScreen">
        <Card className="ViewCard">
          <Card.Title className="PageTitle">{D.surveyList}</Card.Title>
          {
            isLoading || loadingPreferences
              ? <Spinner className="loadingSpinner" animation="border" variant="primary" />
              : (
                <>
                  {
                    data.length > 0
                      ? (
                        <>
                          <PaginationNav.SizeSelector
                            updateFunc={(newPagination) => this.handlePageChange(newPagination)}
                          />
                          <Table id="SurveyList" className="CustomTable" bordered striped hover responsive size="sm">
                            <thead>
                              <tr>
                                <th className="EmptyHeader ColSurvey" />
                                <th className="ColumnSpacing" />
                                <th className="EmptyHeader ColCollectionStartDate" />
                                <th className="EmptyHeader ColCollectionEndDate" />
                                <th className="EmptyHeader ColEndDate" />
                                <th className="ColumnSpacing" />
                                <th className="EmptyHeader ColPhase" />
                                <th className="ColumnSpacing" />
                                <th colSpan="6" className="CenteredText">{D.surveyUnits}</th>
                              </tr>
                              <tr>
                                <th onClick={handleSortFunct('label')} className="Clickable ColSurvey">
                                  <SortIcon val="label" sort={sort} />
                                  {D.survey}
                                </th>
                                <th className="ColumnSpacing" />
                                <th onClick={handleSortFunct('collectionStartDate')} className="Clickable ColCollectionStartDate">
                                  <SortIcon val="collectionStartDate" sort={sort} />
                                  {D.collectionStartDate}
                                </th>
                                <th
                                  data-testid="Header-collection-end-date"
                                  onClick={handleSortFunct('collectionEndDate')}
                                  className="Clickable ColCollectionEndDate"
                                >
                                  <SortIcon val="collectionEndDate" sort={sort} />
                                  {D.collectionEndDate}
                                </th>
                                <th onClick={handleSortFunct('endDate')} className="Clickable ColEndDate">
                                  <SortIcon val="endDate" sort={sort} />
                                  {D.endDate}
                                </th>
                                <th className="ColumnSpacing" />
                                <th onClick={handleSortFunct('phase')} className="Clickable ColPhase">
                                  <SortIcon val="phase" sort={sort} />
                                  {D.phase}
                                </th>
                                <th className="ColumnSpacing" />
                                <th onClick={handleSortFunct('allocated')} className="Clickable ColAllocated">
                                  <SortIcon val="allocated" sort={sort} />
                                  {D.allocated}
                                </th>
                                <th onClick={handleSortFunct('toProcessInterviewer')} className="Clickable ColToProcessInterviewer">
                                  <SortIcon val="toProcessInterviewer" sort={sort} />
                                  {D.toTreatInterviewer}
                                </th>
                                <th onClick={handleSortFunct('toAffect')} className="Clickable ColToAffect">
                                  <SortIcon val="toAffect" sort={sort} />
                                  {D.toBeAssigned}
                                </th>
                                <th onClick={handleSortFunct('toFollowUp')} className="Clickable ColToFollowUp">
                                  <SortIcon val="toFollowUp" sort={sort} />
                                  {D.toRemind}
                                </th>
                                <th onClick={handleSortFunct('toReview')} className="Clickable ColToReview">
                                  <SortIcon val="toReview" sort={sort} />
                                  {D.toBeReviewed}
                                </th>
                                <th onClick={handleSortFunct('finalized')} className="Clickable ColFinalized">
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
                                .map((line) => (
                                  <SurveyListLine key={line.id} lineData={line} allData={data} />
                                ))}
                            </tbody>
                          </Table>
                          <div className="tableOptionsWrapper">
                            <PaginationNav.PageSelector
                              pagination={pagination}
                              updateFunc={(newPagination) => {
                                this.handlePageChange(newPagination);
                              }}
                              numberOfItems={data.length}
                            />
                          </div>
                        </>
                      )
                      : <span>{D.noSurveysToDisplay}</span>
                    }
                </>
              )
          }
        </Card>
      </div>
    );
  }
}

export default MainScreen;
