import React from 'react';


class ListSU extends React.Component {

  render() {
    return (
      <div id='ListSU'>
        <button className='YellowButton' onClick={()=>this.props.returnToMainScreen()}>Retour</button>
        <div className='SurveyTitle'>{this.props.survey}</div>
        <div className='Title'>Unitées enquêtées confiées à la DEM: {108}</div>
        <SUTable {...this.props}/>
      </div>
    );
  }
}

class SUTable extends React.Component {

  render() {
    return (
      <table id='SUTable'>
        <thead>
          <tr>
            <th>Identifiant</th>
            <th>Ssech</th>
            <th>Département</th>
            <th>Commune</th>
            <th>Enquêteur</th>
            <th>Idep</th>
          </tr>
        </thead>
        <tbody>
          {displaySurveyLines(this.props)}
        </tbody>
      </table>
    );
  }
}

class SurveyUnitLine extends React.Component {
  render() {
      const lineColor = this.props.oddLine ? 'DarkgreyLine' : 'LightGreyLine'
      return (
            <tr className={lineColor}>
              <td>{this.props.id}</td>
              <td>{this.props.ssech}</td>
              <td>{this.props.departement}</td>
              <td>{this.props.city}</td>
              <td>{this.props.interviewer}</td>
              <td>{this.props.idep}</td>
            </tr>
      );
  }

}

function displaySurveyLines(props){
  const lines = []
  let key = 0
  let oddLine = true
  props.data.forEach(lineData =>{
    lines.push(<SurveyUnitLine key={key} oddLine={oddLine} {...lineData} {...props}/>)
    oddLine = !oddLine
    key = key + 1
  })
  return lines
}





export default ListSU

// if (process.env.NODE_ENV === "test") {
//    export {displaySurveyLines}
// }
