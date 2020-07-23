import React from 'react';
import Keycloak from 'keycloak-js';
import View from '../View/View';
import Header from '../Header/Header';
import DataFormatter from '../../utils/DataFormatter';
import { AUTHENTICATION_MODE } from '../../config.json';
import { KEYCLOAK, NO_AUTH } from '../../utils/constants.json';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { keycloak: null, authenticated: false, data: null };
  }

  componentDidMount() {
    if (AUTHENTICATION_MODE === NO_AUTH) {
      const dataRetreiver = new DataFormatter();
      dataRetreiver.getUserInfo((data) => {
        this.setState({ authenticated: true, data });
      });
    } else if (AUTHENTICATION_MODE === KEYCLOAK) {
      const keycloak = Keycloak('/keycloak.json');
      keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
        const dataRetreiver = new DataFormatter(keycloak.token);
        dataRetreiver.getUserInfo((data) => {
          this.setState({ keycloak, authenticated, data });
        });
      });
    }
  }

  render() {
    const { keycloak, authenticated, data } = this.state;
    if (keycloak || authenticated) {
      if (authenticated) {
        return (
          <div className="App">
            <Header
              user={data}
              returnFunc={() => { this.content.handleReturnButtonClick(); }}
              goToMonitoringTable={(mode) => {
                this.content.handleMonitoringTableClick(null, null, mode);
              }}
              goToReview={() => {
                this.content.handleReviewClick(null, false);
              }}
            />
            <View
              token={keycloak ? keycloak.token : null}
              ref={(instance) => { this.content = instance; }}
            />
          </div>
        );
      }
      return (<div>Unable to authenticate!</div>);
    }
    return (
      <div>Initializing...</div>
    );
  }
}

export default App;
