import React from 'react';
import MainScreen from './MainScreen.js'
import Header from './Header.js'
import SurveyPortal from './SurveyPortal.js'
import ListSU from './ListSU.js'
import MonitoringTable from './MonitoringTable.js'
import './App.css';
import Service from './Service.js'


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
    getDataForListSU('vqs2021x00',(data)=>{
      this.setState({
        currentView: 'listSU',
        currentSurvey: surveyId,
        data: data
      })
    })
    
  }

  handleMonitoringTableClick(surveyId){
    this.setState({
      currentView: 'monitoringTable',
      currentSurvey: surveyId,
    })
  }

  handleReturnButtonClick(){
    this.setState({
      currentView: 'mainScreen',
      currentSurvey: null,
    })

    getDataForMainScreen((data)=>{
          this.setState({
            data: data,
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
        return <MonitoringTable survey={this.state.currentSurvey} data={[0,0]} returnToMainScreen={()=>{this.handleReturnButtonClick()}}/>
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


function getDataForMainScreen(cb){
  Service.getSurveys((data)=>{
    cb(data)
  });
}

function getDataForListSU(survey, cb){
  Service.getSurveyUnits(survey, (res)=>{
    const promises = []
    res.forEach(su=>{
      if(su.campaign===survey){
        promises.push(
            new Promise((resolve, reject) => {
              Service.getSurveyUnit(su.id,(data)=>{resolve(data)})
            })
          )
      }
    })
    Promise.all(promises).then(data=>{
      const processedData=[]
      data.forEach(su=>{
        const suLine = {}
        suLine.id = su.id
        suLine.ssech = su.sampleIdentifiers.ssech
        suLine.departement = su.geographicalLocation.id
        suLine.city = su.geographicalLocation.label
        suLine.interviewer = 'NA'
        suLine.idep = 'NA'
        processedData.push(suLine)
      })
      cb(processedData)
    })

  })
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
