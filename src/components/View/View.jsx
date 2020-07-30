import React from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import MainScreen from '../MainScreen/MainScreen';
import CampaignPortal from '../CampaignPortal/CampaignPortal';
import ListSU from '../ListSU/ListSU';
import MonitoringTable from '../MonitoringTable/MonitoringTable';
import Review from '../Review/Review';
import DataFormatter from '../../utils/DataFormatter';
import Utils from '../../utils/Utils';
import { BY_INTERVIEWER_ONE_SURVEY, BY_SURVEY, BY_SITE } from '../../utils/constants.json';
import ModalPreferences from '../ModalPreferences/ModalPreferences';
import D from '../../i18n';

class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      survey: null,
      data: [],
      sort: { sortOn: null, asc: null },
      showPreferences: false,
      preferences: {},
      loading: false,
    };
    this.dataRetreiver = new DataFormatter(props.token);
  }

  componentDidMount() {
    this.loadPreferences();
  }

  componentDidUpdate(prevProps) {
    const { currentView } = this.props;
    if (prevProps.currentView !== currentView) {
      this.setState({ loading: false });
    }
  }

  loadPreferences() {
    this.dataRetreiver.getPreferences((preferences) => {
      this.setState({ preferences });
      this.handleReturnButtonClick();
    });
  }

  handleCampaignClick(survey, mainScreenData) {
    const { setCurrentView, currentView } = this.props;
    this.dataRetreiver.getDataForCampaignPortal(survey.id, (res) => {
      const newData = {};
      Object.assign(newData, res);
      Object.assign(newData, mainScreenData);
      this.setState({
        data: newData,
        survey,
        loading: (currentView !== 'campaignPortal'),
      });
      setCurrentView('campaignPortal');
    });
  }

  handleListSUClick(survey) {
    const { setCurrentView, currentView } = this.props;
    this.dataRetreiver.getDataForListSU(survey.id, (data) => {
      this.setState({
        survey,
        data,
        loading: (currentView !== 'listSU'),
      });
      setCurrentView('listSU');
    });
  }

  async handleMonitoringTableClick(survey, date, mode) {
    const { setCurrentView, currentView } = this.props;
    const dateToUse = date || new Date().toISOString().slice(0, 10);
    const modeToUse = mode || BY_INTERVIEWER_ONE_SURVEY;
    const paginationToUse = { size: 5, page: 1 };
    let surveyToUse;
    if (!survey) {
      surveyToUse = await this.dataRetreiver.getDataForMainScreen();
    } else {
      surveyToUse = survey.id;
    }
    this.dataRetreiver.getDataForMonitoringTable(surveyToUse, dateToUse, paginationToUse, modeToUse,
      (res) => {
        const newData = {};
        Object.assign(newData, res);
        newData.date = dateToUse;
        newData.pagination = paginationToUse;
        this.setState({
          survey,
          monitoringTableMode: modeToUse,
          data: newData,
          loading: (currentView !== 'monitoringTable'),
        });
        setCurrentView('monitoringTable');
        let firstColumnSortAttribute;
        if (modeToUse === BY_SURVEY) {
          firstColumnSortAttribute = 'survey';
        } else if (modeToUse === BY_SITE) {
          firstColumnSortAttribute = 'site';
        } else {
          firstColumnSortAttribute = 'CPinterviewer';
        }
        this.handleSort(firstColumnSortAttribute, true);
      });
  }

  async handleReviewClick(survey) {
    const { setCurrentView, currentView } = this.props;
    let surveyId = null;
    if (survey) surveyId = survey.id;
    this.dataRetreiver.getDataForReview(surveyId, (data) => {
      const datas = {};
      datas.listSU = data;
      this.setState({
        survey,
        data: datas,
        loading: (currentView !== 'review'),
      });
      setCurrentView('review');
    });
  }

  updateInterviewersDetail(surveyId, date, pagination, interviewersToFetched, useDebounce) {
    const { data } = this.state;
    (useDebounce
      ? this.updateInterviewersDetailDebounced(surveyId, interviewersToFetched, date, pagination)
      : this.dataRetreiver.getInterviewersDetail(surveyId, interviewersToFetched, date, pagination))
      .then((interviewersDetail) => {
        const newData = {};
        Object.assign(newData, data);
        newData.interviewersDetail = interviewersDetail;
        newData.relevantInterviewers = interviewersToFetched;
        newData.pagination = pagination;
        newData.date = date;
        this.setState({ data: newData });
      });
  }

  handleReturnButtonClick() {
    const { setCurrentView, currentView } = this.props;
    const { preferences } = this.state;
    this.dataRetreiver.getDataForMainScreen((data) => {
      const dataToUse = [];
      data.forEach((survey) => {
        if (preferences[survey.id] && preferences[survey.id].preference) {
          dataToUse.push(survey);
        }
      });
      this.setState({
        survey: null,
        data: dataToUse,
        loading: (currentView !== 'mainScreen'),
      });
      setCurrentView('mainScreen');
      this.handleSort('label', true);
    });
  }

  updatePreferences(newPreferences) {
    this.dataRetreiver.updatePreferences(newPreferences, (res) => {
      if (res.status === 200 || res.status === 201 || res.status === 204) {
        NotificationManager.success(D.preferencesUpdated, D.updateSuccess, 3500);
      } else {
        NotificationManager.error(D.preferencesNotUpdated, D.error, 3500);
      }
      this.handleReturnButtonClick();
    });
  }

  validateSU(survey, lstSUFinalized) {
    this.dataRetreiver.finalizeSurveyUnits(lstSUFinalized)
      .then((res) => {
        if (res.status === 200 || res.status === 201 || res.status === 204) {
          NotificationManager.success(`${D.reviewAlertSuccess}: ${lstSUFinalized.join(', ')}.`, D.updateSuccess, 3500);
        } else {
          NotificationManager.error(D.reviewAlertError, D.error, 3500);
        }
        this.handleReviewClick(survey);
      });
  }

  handleSort(sortOn, asc) {
    const { data, sort } = this.state;
    const { currentView } = this.props;
    let newOrder = asc;
    if (asc === undefined) {
      newOrder = sortOn !== sort.sortOn || !sort.asc;
    }
    let sortedData = {};
    switch (currentView) {
      case 'mainScreen':
        sortedData = Utils.sortData(data, sortOn, newOrder);
        break;
      case 'campaignPortal':
        Object.assign(sortedData, data);
        sortedData.interviewers = Utils.sortData(data.interviewers, sortOn, newOrder);
        break;
      case 'monitoringTable':
        Object.assign(sortedData, data);
        sortedData.interviewersDetail = Utils.sortData(data.interviewersDetail, sortOn, newOrder);
        break;
      case 'review':
        Object.assign(sortedData, data);
        sortedData = Utils.sortData(data, sortOn, newOrder);
        break;
      default:
        Object.assign(sortedData, data);
        break;
    }

    this.setState({ data: sortedData, sort: { sortOn, asc: newOrder } });
  }

  showPreferences() {
    this.setState({ showPreferences: true });
  }

  hidePreferences() {
    this.setState({ showPreferences: false });
  }

  render() {
    const {
      survey, data, sort, monitoringTableMode, showPreferences, preferences, loading,
    } = this.state;
    const { currentView } = this.props;
    let selectedView;
    switch (currentView) {
      case 'campaignPortal':
        selectedView = (
          <CampaignPortal
            data={data}
            sort={sort}
            survey={survey}
            returnToMainScreen={() => { this.handleReturnButtonClick(); }}
            handleSort={(sortOn) => this.handleSort(sortOn)}
            handleCampaignClick={
              (newSurvey, mainScreenData) => this.handleCampaignClick(newSurvey, mainScreenData)
            }
          />
        );
        break;
      case 'listSU':
        selectedView = (
          <ListSU
            survey={survey}
            data={data}
            returnToMainScreen={() => { this.handleReturnButtonClick(); }}
          />
        );
        break;
      case 'review':
        selectedView = (
          <Review
            data={data}
            sort={sort}
            survey={survey}
            handleSort={(sortOn) => this.handleSort(sortOn)}
            validateSU={
              (surveyId, lstSUFinalized) => this.validateSU(surveyId, lstSUFinalized)
            }
            goToReview={(surveyId) => this.handleReviewClick(surveyId)}
            returnToMainScreen={() => { this.handleReturnButtonClick(); }}
          />
        );
        break;
      case 'monitoringTable':
        selectedView = (
          <MonitoringTable
            survey={survey}
            data={data}
            sort={sort}
            mode={monitoringTableMode}
            returnToMainScreen={() => { this.handleReturnButtonClick(); }}
            goToMonitoringTable={(surveyId, date, pagination, mode) => {
              this.handleMonitoringTableClick(surveyId, date, pagination, mode);
            }}
            handleSort={(sortOn) => this.handleSort(sortOn)}
          />
        );
        break;
      default:
        selectedView = (
          <MainScreen
            data={data}
            sort={sort}
            goToCampaignPortal={(newSurvey, mainScreenData) => {
              this.handleCampaignClick(newSurvey, mainScreenData);
            }}
            goToReview={(newSurvey) => { this.handleReviewClick(newSurvey, null, false); }}
            goToListSU={(surveyId) => { this.handleListSUClick(surveyId); }}
            goToMonitoringTable={(surveyId, mode) => {
              this.handleMonitoringTableClick(surveyId, null, mode);
            }}
            handleSort={(sortOn) => this.handleSort(sortOn)}
          />
        );
    }
    selectedView = loading || selectedView;
    return (
      <div>
        {selectedView}
        <ModalPreferences
          preferences={preferences}
          showPreferences={showPreferences}
          hidePreferences={() => this.hidePreferences()}
          updatePreferences={(prefs) => this.updatePreferences(prefs)}
        />
        <NotificationContainer />
      </div>
    );
  }
}

export default View;
