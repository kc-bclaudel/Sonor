import React from 'react';
import MainScreen from './MainScreen.js'
import CampaignPortal from './CampaignPortal.js'
import ListSU from './ListSU.js'
import MonitoringTable from './MonitoringTable.js'
import DataFormatter from './DataFormatter.js';

class View extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentView: 'mainScreen',
      currentSurvey: null,
      data: [],
      dataRetreiver: new DataFormatter(props.keycloak.token)
    };
  }

  componentDidMount() {
    this.handleReturnButtonClick()
  }

  handleCampaignClick(campaignId, campaignName,collectionStartDate,collectionEndDate,treatmentEndDate){
    this.state.dataRetreiver.getDataForCampaignPortal(campaignId, (data)=>{
      data.campaignId= campaignId;
      data.campaignName= campaignName;
      data.collectionEndDate= collectionEndDate;
      data.collectionStartDate= collectionStartDate;
      data.treatmentEndDate= treatmentEndDate;
      this.setState({
          currentView: 'campaignPortal',
          data: data
        })
      })
  }

  handleListSUClick(surveyId){
    this.state.dataRetreiver.getDataForListSU(surveyId,(data)=>{
      this.setState({
        currentView: 'listSU',
        currentSurvey: surveyId,
        data: data
      })
    })
    
  }

  handleMonitoringTableClick(surveyId, date){
    const dateToUse =  date ? date : new Date().toISOString().slice(0,10)
    this.state.dataRetreiver.getDataForMonitoringTable(surveyId, dateToUse, (data)=>{
      data.date = dateToUse
      this.setState({
        currentView: 'monitoringTable',
        currentSurvey: surveyId,
        data: data
      })
    })
  }

  handleReturnButtonClick(){
    this.state.dataRetreiver.getDataForMainScreen((data)=>{
          this.setState({
            currentView: 'mainScreen',
            currentSurvey: null,
            data: data
          })
        })
  }

  render() {
    switch(this.state.currentView){
      case 'campaignPortal':
        return <CampaignPortal data={this.state.data} returnToMainScreen={()=>{this.handleReturnButtonClick()}}/>
      case 'listSU':
        return <ListSU survey={this.state.currentSurvey} data={this.state.data} returnToMainScreen={()=>{this.handleReturnButtonClick()}}/>
      case 'monitoringTable':
        return <MonitoringTable survey={this.state.currentSurvey} data={this.state.data} 
                  returnToMainScreen={()=>{this.handleReturnButtonClick()}}
                  goToMonitoringTable={(surveyId, date)=>{this.handleMonitoringTableClick(surveyId, date)}}
                />
      default:
        return <MainScreen 
                data={this.state.data}
                goToCampaignPortal={(campaignId,campaignName,collectionStartDate,collectionEndDate,treatmentEndDate)=>{this.handleCampaignClick(campaignId,campaignName,collectionStartDate,collectionEndDate,treatmentEndDate)}}
                goToListSU={(surveyId)=>{this.handleListSUClick(surveyId)}}
                goToMonitoringTable={(surveyId)=>{this.handleMonitoringTableClick(surveyId)}}
              />
    }
  }
}



export default View;
