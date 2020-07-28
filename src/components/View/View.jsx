import React from 'react';
import MainScreen from '../MainScreen/MainScreen';
import CampaignPortal from '../CampaignPortal/CampaignPortal';
import ListSU from '../ListSU/ListSU';
import MonitoringTable from '../MonitoringTable/MonitoringTable';
import Review from '../Review/Review';
import AlertContainer from '../AlertContainer/AlertContainer';
import DataFormatter from '../../utils/DataFormatter';
import Utils from '../../utils/Utils';
import { BY_INTERVIEWER_ONE_SURVEY, BY_SURVEY, BY_SITE } from '../../utils/constants.json';
import ModalPreferences from '../ModalPreferences/ModalPreferences';

class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 'mainScreen',
      survey: null,
      data: [],
      alerts: [],
      dataRetreiver: new DataFormatter(props.token),
      sort: { sortOn: null, asc: null },
      showPreferences: false,
      preferences: {},
    };
  }

  componentDidMount() {
    this.loadPreferences();
  }

  loadPreferences() {
    const { dataRetreiver } = this.state;
    dataRetreiver.getPreferences((preferences) => {
      this.setState({ preferences });
      this.handleReturnButtonClick();
    });
  }

  handleCampaignClick(survey, mainScreenData) {
    const { dataRetreiver } = this.state;
    dataRetreiver.getDataForCampaignPortal(survey.id, (res) => {
      const newData = {};
      Object.assign(newData, res);
      Object.assign(newData, mainScreenData);
      this.setState({
        currentView: 'campaignPortal',
        data: newData,
        survey,
      });
    });
  }

  handleListSUClick(survey) {
    const { dataRetreiver } = this.state;
    dataRetreiver.getDataForListSU(survey.id, (data) => {
      this.setState({
        currentView: 'listSU',
        survey,
        data,
      });
    });
  }

  async handleMonitoringTableClick(survey, date, mode) {
    const { dataRetreiver } = this.state;
    const dateToUse = date || new Date().toISOString().slice(0, 10);
    const modeToUse = mode || BY_INTERVIEWER_ONE_SURVEY;
    const paginationToUse = { size: 5, page: 1 };
    let surveyToUse;
    if (!survey) {
      surveyToUse = await dataRetreiver.getDataForMainScreen();
    } else {
      surveyToUse = survey.id;
    }
    dataRetreiver.getDataForMonitoringTable(surveyToUse, dateToUse, paginationToUse, modeToUse,
      (res) => {
        const newData = {};
        Object.assign(newData, res);
        newData.date = dateToUse;
        newData.pagination = paginationToUse;
        this.setState({
          currentView: 'monitoringTable',
          survey,
          monitoringTableMode: modeToUse,
          data: newData,
        });
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

  handleReviewClick(lstSUFinalized, error) {
    const { dataRetreiver } = this.state;
    dataRetreiver.getDataForReview((data) => {
      const datas = {};
      datas.listSU = data;
      datas.lstSUFinalized = lstSUFinalized;
      datas.errorOccurred = error;
      this.setState({
        currentView: 'review',
        data: datas,
      });
    });
  }

  updateInterviewersDetail(surveyId, date, pagination, interviewersToFetched, useDebounce) {
    const { dataRetreiver, data } = this.state;
    (useDebounce
      ? this.updateInterviewersDetailDebounced(surveyId, interviewersToFetched, date, pagination)
      : dataRetreiver.getInterviewersDetail(surveyId, interviewersToFetched, date, pagination))
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
    const { dataRetreiver, preferences } = this.state;
    dataRetreiver.getDataForMainScreen((data) => {
      const dataToUse = [];
      data.forEach((survey) => {
        if (preferences[survey.id] && preferences[survey.id].preference) {
          dataToUse.push(survey);
        }
      });
      this.setState({
        currentView: 'mainScreen',
        survey: null,
        data: dataToUse,
      });
      this.handleSort('label', true);
    });
  }

  updatePreferences(newPreferences) {
    const { dataRetreiver } = this.state;
    dataRetreiver.updatePreferences(newPreferences, (res) => {
      if (res.status === 200 || res.status === 201 || res.status === 204) {
        this.addAlert({ variant: 'success', heading: '', text: 'Your preferences have been updated' });
      } else {
        this.addAlert({ variant: 'danger', heading: '', text: 'Your preferences could not be updated' });
      }
      this.handleReturnButtonClick();
    });
  }

  addAlert(alert) {
    const { alerts } = this.state;
    const newAlerts = alerts;
    newAlerts.push(alert);
    this.setState({ alerts: newAlerts });
  }

  handleSort(sortOn, asc) {
    const { data, sort, currentView } = this.state;
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
      currentView, survey, data, sort, monitoringTableMode, showPreferences, preferences, alerts,
    } = this.state;
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
            handleSort={(sortOn) => this.handleSort(sortOn)}
            handleReviewClick={
              (lstSUFinalized, error) => this.handleReviewClick(lstSUFinalized, error)
            }
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
            goToReview={() => { this.handleReviewClick(null, false); }}
            goToListSU={(surveyId) => { this.handleListSUClick(surveyId); }}
            goToMonitoringTable={(surveyId, mode) => {
              this.handleMonitoringTableClick(surveyId, null, mode);
            }}
            handleSort={(sortOn) => this.handleSort(sortOn)}
          />
        );
    }
    return (
      <div>
        {selectedView}
        <ModalPreferences
          preferences={preferences}
          showPreferences={showPreferences}
          hidePreferences={() => this.hidePreferences()}
          updatePreferences={(prefs) => this.updatePreferences(prefs)}
        />
        <AlertContainer alerts={alerts} />
      </div>
    );
  }
}

export default View;
