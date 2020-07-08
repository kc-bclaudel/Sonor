import React from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import MainScreen from '../MainScreen/MainScreen';
import CampaignPortal from '../CampaignPortal/CampaignPortal';
import ListSU from '../ListSU/ListSU';
import MonitoringTable from '../MonitoringTable/MonitoringTable';
import DataFormatter from '../../utils/DataFormatter';

class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 'mainScreen',
      currentSurvey: null,
      data: [],
      dataRetreiver: new DataFormatter(props.keycloak.token),
    };
    const { dataRetreiver } = this.state;
    this.updateFunc = (
      surveyId, interviewersToFetched, date, pagination,
    ) => dataRetreiver.getInterviewersDetail(surveyId, interviewersToFetched, date, pagination);
    this.updateInterviewersDetailDebounced = AwesomeDebouncePromise(this.updateFunc, 250);
  }

  componentDidMount() {
    this.handleReturnButtonClick();
  }

  handleCampaignClick(mainScreenData) {
    const { dataRetreiver } = this.state;
    dataRetreiver.getDataForCampaignPortal(mainScreenData.campaignId, (data) => {
      Object.assign(data, mainScreenData);
      this.setState({
        currentView: 'campaignPortal',
        data,
      });
    });
  }

  handleListSUClick(surveyId) {
    const { dataRetreiver } = this.state;
    dataRetreiver.getDataForListSU(surveyId, (data) => {
      this.setState({
        currentView: 'listSU',
        currentSurvey: surveyId,
        data,
      });
    });
  }

  handleMonitoringTableClick(surveyId, date, pagination) {
    const { dataRetreiver } = this.state;
    const dateToUse = date || new Date().toISOString().slice(0, 10);
    const paginationToUse = pagination || { size: 5, page: 1 };
    dataRetreiver.getDataForMonitoringTable(surveyId, dateToUse, paginationToUse, (newData) => {
      const data = {};
      Object.assign(data, newData);
      data.date = dateToUse;
      data.pagination = paginationToUse;
      this.setState({
        currentView: 'monitoringTable',
        currentSurvey: surveyId,
        data,
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
    const { dataRetreiver } = this.state;
    dataRetreiver.getDataForMainScreen((data) => {
      this.setState({
        currentView: 'mainScreen',
        currentSurvey: null,
        data,
      });
    });
  }

  render() {
    const { currentView, currentSurvey, data } = this.state;
    switch (currentView) {
      case 'campaignPortal':
        return (
          <CampaignPortal
            data={data}
            returnToMainScreen={() => { this.handleReturnButtonClick(); }}
          />
        );
      case 'listSU':
        return (
          <ListSU
            survey={currentSurvey}
            data={data}
            returnToMainScreen={() => { this.handleReturnButtonClick(); }}
          />
        );
      case 'monitoringTable':
        return (
          <MonitoringTable
            survey={currentSurvey}
            data={data}
            returnToMainScreen={() => { this.handleReturnButtonClick(); }}
            goToMonitoringTable={(surveyId, date, pagination) => {
              this.handleMonitoringTableClick(surveyId, date, pagination);
            }}
            updateInterviewersDetail={
              (surveyId, date, pagination, interviewersToFetched, useDebounce) => {
                this.updateInterviewersDetail(
                  surveyId, date, pagination, interviewersToFetched, useDebounce,
                );
              }
            }
          />
        );
      default:
        return (
          <MainScreen
            data={data}
            goToCampaignPortal={(mainScreenData) => { this.handleCampaignClick(mainScreenData); }}
            goToListSU={(surveyId) => { this.handleListSUClick(surveyId); }}
            goToMonitoringTable={(surveyId) => { this.handleMonitoringTableClick(surveyId); }}
          />
        );
    }
  }
}

export default View;
