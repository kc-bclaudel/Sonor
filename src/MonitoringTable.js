import React from 'react';



class MonitoringTable extends React.Component {

  render() {
    return (
      <div id='MonitoringTable'>
        <button className='YellowButton' onClick={()=>this.props.returnToMainScreen()}>Retour</button>
        <div className='SurveyTitle'>{this.props.survey}</div>
        <div id='dateDisplay' className='Title'>
	        <div className='DateDisplay'>Avancement selon l'état des unitées enquêtées en date du: </div>
	        <input id='datePicker' className='DateDisplay' type='date' value={this.props.data.date} onChange={(e)=>this.props.goToMonitoringTable(this.props.survey, e.target.value)}/>
        </div>
        <FollowUpTable {...this.props}/>
      </div>
    );
  }
}

class FollowUpTable extends React.Component {

  render() {
    return (
      <table id='FollowUpTable'>
        <thead>
          <tr>
            <th rowSpan='2'>Enquêteur</th>
            <th rowSpan='2' className='ColumnSpacing'/>
            <th rowSpan='2' className='YellowHeader'>Taux d'avancement</th>
            <th rowSpan='2' className='ColumnSpacing'/>
            <th colSpan='6'>Nombre d'unités enquêtées</th>
            <th rowSpan='2' className='ColumnSpacing'/>
            <th colSpan='4' className='YellowHeader'>Unités enquêtées en cours de collecte</th>
          </tr>
          <tr>
            <th>Confiées</th>
            <th>Non commencées</th>
            <th>En cours</th>
            <th>En attente de validation enquêteur</th>
            <th>Valiées enquêteur</th>
            <th>Validées DEM</th>
            <th className='YellowHeader'>En préparation</th>
            <th className='YellowHeader'>Au moins un contact</th>
            <th className='YellowHeader'>RDV pris</th>
            <th className='YellowHeader'>Questionnaire démarré</th>
          </tr>
        </thead>
        <tbody>
          {displayFollowUpTableLines(this.props)}
        </tbody>
        <tfoot>
        	<tr>
        		<th>Total DEM</th>
        		<th className='ColumnSpacing'/>
        		<th className='YellowHeader'>{(Math.round(this.props.data.total.dem.completionRate * 1000) / 1000)*100}%</th>
        		<th className='ColumnSpacing'/>
        		<th>{this.props.data.total.dem.total}</th>
        		<th>{this.props.data.total.dem.notStarted}</th>
        		<th>{this.props.data.total.dem.onGoing}</th>
        		<th>{this.props.data.total.dem.waitingForIntValidation}</th>
        		<th>{this.props.data.total.dem.intValidated}</th>
        		<th>{this.props.data.total.dem.demValidated}</th>
        		<th className='ColumnSpacing'/>
        		<th className='YellowHeader'>{this.props.data.total.dem.preparingContact}</th>
        		<th className='YellowHeader'>{this.props.data.total.dem.atLeastOneContact}</th>
        		<th className='YellowHeader'>{this.props.data.total.dem.appointmentTaken}</th>
        		<th className='YellowHeader'>{this.props.data.total.dem.interviewStarted}</th>
        	</tr>
        	<tr>
        		<th>Total France</th>
        		<th className='ColumnSpacing'/>
        		<th className='YellowHeader'>{(Math.round(this.props.data.total.france.completionRate * 1000) / 1000)*100}%</th>
        		<th className='ColumnSpacing'/>
        		<th>{this.props.data.total.france.total}</th>
        		<th>{this.props.data.total.france.notStarted}</th>
        		<th>{this.props.data.total.france.onGoing}</th>
        		<th>{this.props.data.total.france.waitingForIntValidation}</th>
        		<th>{this.props.data.total.france.intValidated}</th>
        		<th>{this.props.data.total.france.demValidated}</th>
        		<th className='ColumnSpacing'/>
        		<th className='YellowHeader'>{this.props.data.total.france.preparingContact}</th>
        		<th className='YellowHeader'>{this.props.data.total.france.atLeastOneContact}</th>
        		<th className='YellowHeader'>{this.props.data.total.france.appointmentTaken}</th>
        		<th className='YellowHeader'>{this.props.data.total.france.interviewStarted}</th>
        	</tr>
        </tfoot>
      </table>
    );
  }
}

class FollowUpTableLine extends React.Component {
  render() {
      const lineColor = this.props.oddLine ? 'DarkgreyLine' : 'LightGreyLine'
      return (
            <tr className={lineColor}>
              	<td>{this.props.interviewer}</td>
        		<td className='ColumnSpacing'/>
        		<td>{(Math.round(this.props.completionRate * 1000) / 1000)*100}%</td>
        		<td className='ColumnSpacing'/>
        		<td>{this.props.total}</td>
        		<td>{this.props.notStarted}</td>
        		<td>{this.props.onGoing}</td>
        		<td>{this.props.waitingForIntValidation}</td>
        		<td>{this.props.intValidated}</td>
        		<td>{this.props.demValidated}</td>
        		<td className='ColumnSpacing'/>
        		<td>{this.props.preparingContact}</td>
        		<td>{this.props.atLeastOneContact}</td>
        		<td>{this.props.appointmentTaken}</td>
        		<td>{this.props.interviewStarted}</td>
            </tr>
      );
  }

}

function displayFollowUpTableLines(props){
  const lines = []
  let key = 0
  let oddLine = true
  props.data.interviewers.forEach(lineData =>{
    lines.push(<FollowUpTableLine key={key} oddLine={oddLine} {...lineData} {...props}/>)
    oddLine = !oddLine
    key = key + 1
  })
  return lines
}


export default MonitoringTable;
