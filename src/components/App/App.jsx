import React from 'react';
import Keycloak from 'keycloak-js';
import View from '../View/View';
import Header from '../Header/Header';
import DataFormatter from '../../utils/DataFormatter';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { keycloak: null, authenticated: false, data: null };
  }

  componentDidMount() {
    const keycloak = Keycloak('/keycloak.json');
    keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
      const dataRetreiver = new DataFormatter(keycloak.token);
      dataRetreiver.getUserInfo((data) => {
        this.setState({ keycloak, authenticated, data });
      });
    });
  }

  render() {
    const { keycloak, authenticated, data } = this.state;
    if (keycloak) {
      if (authenticated) {
        return (
          <div className="App">
            <Header user={data} returnFunc={() => { this.content.handleReturnButtonClick(); }} goToMonitoringTable={(surveyId) => { this.content.handleMonitoringTableClick(surveyId); }} />
            <View keycloak={keycloak} ref={(instance) => { this.content = instance; }} />
          </div>
        );
      }
      return (<div>Unable to authenticate!</div>);
    }
    return (
      <div>Initializing Keycloak...</div>
    );
  }
}

export default App;
