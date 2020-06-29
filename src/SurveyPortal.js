import React from 'react';



class SurveyPortal extends React.Component {

  render() {
    return (
      <div id='SurveyPortal'>
        <button className='YellowButton' onClick={()=>this.props.returnToMainScreen()} data-testid='return-button'>Retour</button>
        <div className='SurveyTitle'>{this.props.survey}</div>
        <TimeLine/>
        <div id='SurveyPortalView'>
          <Contacts/>
          <SurveyUnits/>
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
            <div>01/01/2020</div>
            <div className='DateCenter'>01/01/2020</div>
            <div className='DateCenter'>01/01/2020</div>
            <div className='DateRight'>01/01/2020</div>
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

class Contacts extends React.Component {

  render() {
    return (
        <div id='Contacts'>
          <div className='Title'>Contacts</div>

          <table>
            <tbody>
                <tr>
                  <th>Enquête</th>
                  <td className='LightGreyLine'>gestion-enquete-mobilités</td>
                </tr>
                <tr>
                  <th rowSpan='2'>CPOS</th>
                  <td className='LightGreyLine'>Chloé Berlin</td>
                </tr>
                <tr>
                  <td className='LightGreyLine'>01 87 69 64 53</td>
                </tr>
                 <tr>
                  <th rowSpan='2'>Adjoint CPOS</th>
                  <td className='LightGreyLine'>Thierry Fabres</td>
                </tr>
                <tr>
                  <td className='LightGreyLine'>06 23 55 88 22</td>
                </tr>
             </tbody>
          </table>

        </div>
    );
  }
}

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
              <tr>
                <td className='LightGreyLine'>Chloé Berlin</td>
                <td className='LightGreyLine'>CAFDJSK</td>
                <td className='LightGreyLine'>50</td>
              </tr>
              <tr>
                <th>Non attribuée(s)</th>
                <th></th>
                <th>0</th>
              </tr>
              <tr>
                <th>Total DEM</th>
                <th></th>
                <th>108</th>
              </tr>
            </tbody>
          </table>

        </div>
    );
  }
}



export default SurveyPortal;
