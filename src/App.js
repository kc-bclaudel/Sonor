import React from 'react';
import MainScreen from './MainScreen.js'
import Header from './Header.js'
import SurveyPortal from './SurveyPortal.js'
import ListSU from './ListSU.js'
import MonitoringTable from './MonitoringTable.js'
import './App.css';
import DataFormatter from './DataFormatter.js'


class View extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentView: 'mainScreen',
      currentSurvey: null,
      data: []
    };
  }

  componentDidMount() {
    this.handleReturnButtonClick()
  }

  handleSurveyClick(surveyId){
    this.setState({
      currentView: 'surveyPortal',
      currentSurvey: surveyId,
    })
  }

  handleListSUClick(surveyId){
    DataFormatter.getDataForListSU(surveyId,(data)=>{
      this.setState({
        currentView: 'listSU',
        currentSurvey: surveyId,
        data: data
      })
    })
    
  }

  handleMonitoringTableClick(surveyId){
    DataFormatter.getDataForMonitoringTable(surveyId,(data)=>{
      this.setState({
        currentView: 'monitoringTable',
        currentSurvey: surveyId,
        data: data
      })
    })
  }

  handleReturnButtonClick(){
    DataFormatter.getDataForMainScreen((data)=>{
          this.setState({
            currentView: 'mainScreen',
            currentSurvey: null,
            data: data
          })
        })
  }

  render() {
    switch(this.state.currentView){
      case 'surveyPortal':
        return <SurveyPortal survey={this.state.currentSurvey} returnToMainScreen={()=>{this.handleReturnButtonClick()}}/>
      case 'listSU':
        return <ListSU survey={this.state.currentSurvey} data={this.state.data} returnToMainScreen={()=>{this.handleReturnButtonClick()}}/>
      case 'monitoringTable':
        return <MonitoringTable survey={this.state.currentSurvey} data={this.state.data} returnToMainScreen={()=>{this.handleReturnButtonClick()}}/>
      default:
          return <MainScreen 
                data={this.state.data}
                goToSurveyPortal={(surveyId)=>{this.handleSurveyClick(surveyId)}}
                goToListSU={(surveyId)=>{this.handleListSUClick(surveyId)}}
                goToMonitoringTable={(surveyId)=>{this.handleMonitoringTableClick(surveyId)}}
              />
    }
  }
}




function App() {
  return (
    <div className='App'>
      <Header/>
      <View currentView='mainScreen'/>
    </div>
  );
}

export default App;
