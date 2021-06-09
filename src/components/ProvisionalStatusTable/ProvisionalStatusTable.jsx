import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, Redirect } from 'react-router-dom';
import PaginationNav from '../PaginationNav/PaginationNav';
import SearchField from '../SearchField/SearchField';
import SurveySelector from '../SurveySelector/SurveySelector';
import InterviewerSelector from '../InterviewerSelector/InterviewerSelector';
import ProvisionalStatusTableDisplay from './ProvisionalStatusTableDisplay';
import C from '../../utils/constants.json';
import D from '../../i18n';
import Utils from '../../utils/Utils';
import './ProvisionalStatusTable.css';

class ProvisionalStatusTable extends React.Component {
  constructor(props) {
    super(props);
    const mode = Utils.getMonitoringTableModeFromPath(props.location.pathname);
    const { survey, interviewer } = props.location;
    this.state = {
      pagination: { size: 10, page: 1 },
      displayedLines: [],
      date: new Date().toISOString().slice(0, 10),
      survey,
      interviewer,
      mode,
      redirect: (mode === C.BY_INTERVIEWER_ONE_SURVEY && !survey)
        || (mode === C.BY_SURVEY_ONE_INTERVIEWER && !interviewer)
        ? '/' : null,
      loading: true,
    };
    this.componentIsMounted = false;
  }

  componentDidMount() {
    this.componentIsMounted = true;
    this.refreshData();
  }

  componentDidUpdate(prevprops) {
    const { location } = this.props;
    if (location.pathname !== prevprops.location.pathname) {
      this.refreshData();
    }
  }

  componentWillUnmount() {
    this.componentIsMounted = false;
  }

  async refreshData() {
    const { dataRetreiver, location } = this.props;
    const { survey, interviewer } = location;
    const { date } = this.state;
    const dateToUse = date || new Date().toISOString().slice(0, 10);
    const modeToUse = Utils.getMonitoringTableModeFromPath(location.pathname);
    const paginationToUse = { size: 5, page: 1 };
    let surveyToUse;
    if (interviewer) {
      surveyToUse = interviewer;
    } else if (modeToUse !== C.BY_INTERVIEWER_ONE_SURVEY && modeToUse !== C.BY_SITE) {
      surveyToUse = await dataRetreiver.getDataForMainScreen();
    } else {
      surveyToUse = survey;
    }
    if (surveyToUse) {
      this.setState({ loading: true });
      dataRetreiver.getDataForProvisionalStatusTable(
        surveyToUse, new Date(dateToUse).getTime(), paginationToUse, modeToUse,
        (res) => {
          console.log(res)
          if (dateToUse === this.state.date) {
            const newData = {};
            Object.assign(newData, res);
            newData.date = dateToUse;
            newData.pagination = paginationToUse;
            if (this.componentIsMounted) {
              this.setState({
                date: dateToUse,
                survey,
                interviewer,
                displayedLines: newData.linesDetails,
                data: newData,
                mode: modeToUse,
                redirect: null,
                loading: false,
                sort: { sortOn: null, asc: null },
              }, () => {
                let firstColumnSortAttribute;
                if (modeToUse === C.BY_SURVEY || modeToUse === C.BY_SURVEY_ONE_INTERVIEWER) {
                  firstColumnSortAttribute = 'survey';
                } else {
                  firstColumnSortAttribute = 'CPinterviewer';
                }
                this.handleSort(firstColumnSortAttribute, true);
              });
            }
          }
        },
      );
    } else {
      this.setState({ redirect: '/' });
    }
  }

  handlePageChange(pagination) {
    this.setState({ pagination });
  }

  updateInterviewers(matchingLines) {
    const { pagination } = this.state;
    this.setState({
      pagination: { size: pagination.size, page: 1 },
      displayedLines: matchingLines,
    });
  }

  handleSort(property, asc) {
    const { data, sort } = this.state;
    const [sortedData, newSort] = Utils.handleSort(property, data, sort, 'monitoringTable', asc);
    this.setState({ data: sortedData, sort: newSort });
  }

  render() {
    const {
      survey, data, displayedLines, pagination, date, mode, redirect, sort, loading, interviewer,
    } = this.state;

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    let tableTitle = false;
    let selector = false;
    if (!!interviewer && mode === C.BY_SURVEY_ONE_INTERVIEWER) {
      tableTitle = (<div className="SurveyTitle">{`${interviewer.interviewerFirstName} ${interviewer.interviewerLastName}`}</div>);
      selector = (
        <InterviewerSelector
          interviewer={interviewer}
          updateFunc={(newInterviewer) => this.setState({
            interviewer: newInterviewer,
            redirect: {
              pathname: `/provisionalStatus/campaigns/interviewer/${newInterviewer.id}`,
              interviewer: newInterviewer,
            },
          })}
        />
      );
    } else if (!!survey && (mode === C.BY_INTERVIEWER_ONE_SURVEY)) {
      tableTitle = (<div className="SurveyTitle">{survey.label}</div>);
      selector = (
        <SurveySelector
          survey={survey}
          updateFunc={(newSurvey) => this.setState({
            survey: newSurvey,
            redirect: {
              pathname: `/provisionalStatus/campaign/${newSurvey.id}`,
              survey: newSurvey,
            },
          })}
        />
      );
    }

    let fieldsToSearch;
    if (mode === C.BY_SURVEY_ONE_INTERVIEWER) {
      fieldsToSearch = ['survey'];
    } else {
      fieldsToSearch = ['interviewerFirstName', 'interviewerLastName'];
    }

    return (
      <div id="ProvisionalStatusTable">
        <Container fluid>
          <Row>
            <Col>
              <Link to="/" className="ButtonLink ReturnButtonLink">
                <Button className="ReturnButton" data-testid="return-button">{D.back}</Button>
              </Link>
            </Col>
            <Col xs={6}>
              {tableTitle}
            </Col>
            <Col>
              {selector}
            </Col>
          </Row>
        </Container>
        <Card className="ViewCard">
          <Card.Title className="PageTitle">
            <div className="DateDisplay">{D.provisionalStatusTableIntroductionSentence}</div>
            <input
              id="datePicker"
              data-testid="date-picker"
              className="DateDisplay"
              type="date"
              value={date}
              onChange={(e) => this.setState({ date: e.target.value }, () => this.refreshData())}
            />
          </Card.Title>
          {
          loading
            ? <Spinner className="loadingSpinner" animation="border" variant="primary" />
            : (
              <>
                {
                  data.linesDetails.length > 0
                    ? (
                      <>
                        <Row>
                          <Col xs="6">
                            <PaginationNav.SizeSelector
                              updateFunc={(newPagination) => {
                                this.handlePageChange(newPagination);
                              }}
                            />
                          </Col>
                          <Col xs="6" className="text-right">
                            <SearchField
                              data={data.linesDetails}
                              searchBy={fieldsToSearch}
                              updateFunc={
                                (matchingInterviewers) => this.updateInterviewers(matchingInterviewers)
                              }
                            />
                          </Col>
                        </Row>
                        <ProvisionalStatusTableDisplay
                          pagination={pagination}
                          displayedLines={displayedLines}
                          total={data.total}
                          mode={mode}
                          handleSort={(property) => this.handleSort(property)}
                          sort={sort}
                        />
                        <div className="tableOptionsWrapper">
                          <PaginationNav.PageSelector
                            pagination={pagination}
                            updateFunc={(newPagination) => {
                              this.handlePageChange(newPagination);
                            }}
                            numberOfItems={displayedLines.length}
                          />
                        </div>
                      </>
                    )
                    : <span>{D.nothingToDisplay}</span>
              }
              </>
            )
          }
        </Card>
      </div>
    );
  }
}

export default ProvisionalStatusTable;
