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
    lines.push(<SurveyListLine key={key} oddLine={oddLine} {...lineData} {...props}/>)
    oddLine = !oddLine
    key = key + 1
  })
  return lines
}

class SurveyListLine extends React.Component {

  render() {
      const lineColor = this.props.oddLine ? 'DarkgreyLine' : 'LightGreyLine'
      const goToPortal = ()=>{this.props.goToSurveyPortal(this.props.study)}
      const goToListSU = ()=>{this.props.goToListSU(this.props.study)}
      const goToMonitoringTable = ()=>{this.props.goToMonitoringTable(this.props.study)}
      return (
            <tr className={lineColor}>
              <td onClick={goToPortal} className='Clickable' data-testid='campaign-label'>{this.props.study}</td>
              <td className='ColumnSpacing'/>
              <td onClick={goToPortal} className='Clickable'>{this.props.collectionStart}</td>
              <td onClick={goToPortal} className='Clickable'>{this.props.collectionEnd}</td>
              <td onClick={goToPortal} className='Clickable'>{this.props.endOfProcess}</td>
              <td className='ColumnSpacing'/>
              <td onClick={goToPortal} className='Clickable'>{this.props.phase}</td>
              <td className='ColumnSpacing'/>
              <td onClick={goToListSU} className='Clickable'>{this.props.affected}</td>
              <td>{this.props.toBeAffected}</td>
              <td onClick={goToMonitoringTable} className='Clickable'>{this.props.ongoing}</td>
              <td>{this.props.toBeControled}</td>
            </tr>
      );
  }

}


export default MainScreen;
