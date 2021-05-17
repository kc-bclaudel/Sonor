import React from 'react';
import Keycloak from 'keycloak-js';
import View from '../View/View';
import DataFormatter from '../../utils/DataFormatter';
import { KEYCLOAK, ANONYMOUS } from '../../utils/constants.json';
import initConfiguration from '../../initConfiguration';
import D from '../../i18n';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keycloak: null,
      authenticated: false,
      contactFailed: false,
      initialisationFailed: false,
      data: null,
    };
  }

  async componentDidMount() {
    try {
      await initConfiguration();
    } catch (e) {
      this.setState({ initialisationFailed: true });
    }
    if (window.localStorage.getItem('AUTHENTICATION_MODE') === ANONYMOUS) {
      const dataRetreiver = new DataFormatter();
      dataRetreiver.getUserInfo((data) => {
        if (data.error) {
          this.setState({ contactFailed: true });
        } else {
          this.setState({ authenticated: true, data });
        }
      });
    } else if (window.localStorage.getItem('AUTHENTICATION_MODE') === KEYCLOAK) {
      const keycloak = Keycloak('/keycloak.json');
      keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).then((authenticated) => {
        const dataRetreiver = new DataFormatter(keycloak);
        dataRetreiver.getUserInfo((data) => {
          this.setState({ keycloak, authenticated, data });
        });
        // Update 20 seconds before expiracy
        const updateInterval = (keycloak.tokenParsed.exp + keycloak.timeSkew)
          * 1000
          - new Date().getTime()
          - 20000;
        setInterval(() => {
          keycloak.updateToken(100).error(() => {
            throw new Error('Failed to refresh token');
          });
        }, updateInterval);
      });
    }
  }

  render() {
    const {
      keycloak, authenticated, data, contactFailed, initialisationFailed,
    } = this.state;
    if (keycloak || authenticated) {
      if (authenticated) {
        return (
          <div className="App">

            <View
              keycloak={keycloak}
              userData={data}
            />
          </div>
        );
      }
      return (<div>{D.unableToAuthenticate}</div>);
    }
    if (initialisationFailed) {
      return (<div>{D.initializationFailed}</div>);
    }
    if (contactFailed) {
      return (<div>{D.cannotContactServer}</div>);
    }
    return (
      <div>{D.initializing}</div>
    );
  }
}

export default App;
