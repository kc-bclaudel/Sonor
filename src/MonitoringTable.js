import React from 'react';



class MonitoringTable extends React.Component {

  render() {
    return (
      <div id='MonitoringTable'>
        <button className='YellowButton' onClick={()=>this.props.returnToMainScreen()}>Retour</button>
        <div className='SurveyTitle'>{this.props.survey}</div>
        <div className='Title'>Avancement selon l'état des unitées enquêtées en date du: {'01/01/2020'}</div>
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
        		<th className='YellowHeader'></th>
        		<th className='ColumnSpacing'/>
        		<th></th>
        		<th></th>
        		<th></th>
        		<th></th>
        		<th></th>
        		<th></th>
        		<th className='ColumnSpacing'/>
        		<th className='YellowHeader'></th>
        		<th className='YellowHeader'></th>
        		<th className='YellowHeader'></th>
        		<th className='YellowHeader'></th>
        	</tr>
        	<tr>
        		<th>Total France</th>
        		<th className='ColumnSpacing'/>
        		<th className='YellowHeader'></th>
        		<th className='ColumnSpacing'/>
        		<th></th>
        		<th></th>
        		<th></th>
        		<th></th>
        		<th></th>
        		<th></th>
        		<th className='ColumnSpacing'/>
        		<th className='YellowHeader'></th>
        		<th className='YellowHeader'></th>
        		<th className='YellowHeader'></th>
        		<th className='YellowHeader'></th>
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
              	<td></td>
        		<td className='ColumnSpacing'/>
        		<td></td>
        		<td className='ColumnSpacing'/>
        		<td></td>
        		<td></td>
        		<td></td>
        		<td></td>
        		<td></td>
        		<td></td>
        		<td className='ColumnSpacing'/>
        		<td></td>
        		<td></td>
        		<td></td>
        		<td></td>
            </tr>
      );
  }

}

function displayFollowUpTableLines(props){
	console.log(props.data)
  const lines = []
  let key = 0
  let oddLine = true
  props.data.forEach(lineData =>{
    lines.push(<FollowUpTableLine key={key} oddLine={oddLine} {...lineData} {...props}/>)
    oddLine = !oddLine
    key = key + 1
  })
  return lines
}


export default MonitoringTable;
