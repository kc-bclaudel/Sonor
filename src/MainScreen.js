import React from 'react';


class MainScreen extends React.Component {

  render() {

      return (
        <div id='MainScreen'>
          <div id='SurveyListTitle'>Liste des enquêtes</div>
          <table id='SurveyList'>
            <thead>
              <tr>
                <th rowSpan='2'>Enquête</th>
                <th rowSpan='2' className='ColumnSpacing'/>
                <th rowSpan='2'>Début collecte</th>
                <th rowSpan='2'>Fin collecte </th>
                <th rowSpan='2'>Fin traitement</th>
                <th rowSpan='2' className='ColumnSpacing'/>
                <th rowSpan='2'>Phase</th>
                <th rowSpan='2' className='ColumnSpacing'/>
                <th colSpan='4'>Unités enquêtées</th>
              </tr>
              <tr>
                <th>Confiées</th>
                <th>À affecter</th>
                <th>En cours</th>
                <th>À controler</th>
              </tr>
            </thead>
            <tbody>
              {displaySurveyLines(this.props)}
            </tbody>
          </table>
        </div>
      );
  }

}

function displaySurveyLines(props){
  const lines = []
  let key = 0
  let oddLine = true
  props.data.forEach(lineData =>{
    lines.push(<SurveyListLine key={key} oddLine={oddLine} lineData={lineData} {...props}/>)
    oddLine = !oddLine
    key = key + 1
  })
  return lines
}


class SurveyListLine extends React.Component {

  render() {
      const data = this.props.lineData
      const lineColor = this.props.oddLine ? 'DarkgreyLine' : 'LightGreyLine'
      const goToPortal = ()=>{this.props.goToCampaignPortal(data)}
      const goToListSU = ()=>{this.props.goToListSU(data.id)}
      const goToMonitoringTable = ()=>{this.props.goToMonitoringTable(data.label)}
      return (
            <tr className={lineColor}>
              <td onClick={goToPortal} className='Clickable' data-testid='campaign-label'>{data.label}</td>
              <td className='ColumnSpacing'/>
              <td onClick={goToPortal} className='Clickable'>{data.collectionStartDate}</td>
              <td onClick={goToPortal} className='Clickable'>{data.collectionEndDate}</td>
              <td onClick={goToPortal} className='Clickable'>{data.treatmentEndDate}</td>
              <td className='ColumnSpacing'/>
              <td onClick={goToPortal} className='Clickable'>{data.phase}</td>
              <td className='ColumnSpacing'/>
              <td onClick={goToListSU} className='Clickable'>{data.affected}</td>
              <td>{data.toAffect}</td>
              <td onClick={goToMonitoringTable} className='Clickable'>{data.inProgress}</td>
              <td>{data.toControl}</td>
            </tr>
      );
  }

}

export default MainScreen;
