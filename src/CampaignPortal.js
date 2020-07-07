import React from 'react';



class CampaignPortal extends React.Component {
  render() {
    return (
      <div id='CampaignPortal'>
        <button className='YellowButton' onClick={()=>this.props.returnToMainScreen()} data-testid='return-button'>Retour</button>
        <div className='SurveyTitle'>{this.props.data.label}</div>
        <TimeLine {...this.props}/>
        <div id='CampaignPortalView'>
          {/* <Contacts/> */}
          <SurveyUnits {...this.props}/>
        </div>
      </div>
    );
  }
}

class TimeLine extends React.Component {

  render() {
    return (
        <div id='TimeLine'>
          <div id='PhaseMilestones'>
            <div>N/A</div>
            <div className='DateCenter'>{this.props.data.collectionStartDate}</div>
            <div className='DateCenter'>{this.props.data.collectionEndDate}</div>
            <div className='DateRight'>{this.props.data.treatmentEndDate}</div>
          </div>
          <div id='PhaseDisplay'>
            <div>Affectation initiale</div>
            <div>Collecte en cours</div>
            <div>Collecte terminée</div>
          </div>
          <div id='PhaseMilestones'>
            <div>integration</div>
            <div className='LabelCenter'>début de collecte</div>
            <div className='LabelCenter'>fin de collecte</div>
            <div className='LabelRight'>fin de traitement</div>
          </div>

        </div>
    );
  }
}

// class Contacts extends React.Component {

//   render() {
//     return (
//         <div id='Contacts'>
//           <div className='Title'>Contacts</div>

//           <table>
//             <tbody>
//                 <tr>
//                   <th>Enquête</th>
//                   <td className='LightGreyLine'>gestion-enquete-mobilités</td>
//                 </tr>
//                 <tr>
//                   <th rowSpan='2'>CPOS</th>
//                   <td className='LightGreyLine'>Chloé Berlin</td>
//                 </tr>
//                 <tr>
//                   <td className='LightGreyLine'>01 87 69 64 53</td>
//                 </tr>
//                  <tr>
//                   <th rowSpan='2'>Adjoint CPOS</th>
//                   <td className='LightGreyLine'>Thierry Fabres</td>
//                 </tr>
//                 <tr>
//                   <td className='LightGreyLine'>06 23 55 88 22</td>
//                 </tr>
//              </tbody>
//           </table>

//         </div>
//     );
//   }
// }

class SurveyUnits extends React.Component {

  render() {
    return (
        <div id='SurveyUnits'>
          <div className='Title'>Unités enquêtées</div>

          <table>
            <tbody>
               
              <tr>
                <th>Enquêteur</th>
                <th>Idep</th>
                <th>UE</th>
              </tr>
              {displayInterviewersLines(this.props)}
              <tr>
                <th>Non attribuée(s)</th>
                <th></th>
                <th>{this.props.data.notAttributed.count}</th>
              </tr>
              <tr>
                <th>Total DEM</th>
                <th></th>
                <th>{this.props.data.total.DEM.total}</th>
              </tr>
            </tbody>
          </table>

        </div>
    );
  }
}

function displayInterviewersLines(props){
  const lines = []
  props.data.interviewers.forEach(interviewer =>{
    lines.push(<InterviewerLine key={interviewer.id} {...interviewer} {...props}/>)
  })
  return lines
}

class InterviewerLine extends React.Component {
  render() {
      return (
        <tr>
          <td className='LightGreyLine'>{this.props.interviewerFirstName} {this.props.interviewerLastName}</td>
          <td className='LightGreyLine'>{this.props.id}</td>
          <td className='LightGreyLine'>{this.props.surveyUnitCount}</td>
        </tr>
      );
  }

}

export default CampaignPortal;
