import React from 'react';
import Keycloak from 'keycloak-js';
import View from '../View/View';
import Header from '../Header/Header';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { keycloak: null, authenticated: false };
  }

  componentDidMount() {
    const keycloak = Keycloak('/keycloak.json');
    keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
      this.setState({ keycloak, authenticated });
    });
  }

  render() {
    const { keycloak, authenticated } = this.state;
    if (keycloak) {
      if (authenticated) {
        return (
          <div className="App">
            <Header keycloak={keycloak} />
            <View currentView="mainScreen" keycloak={keycloak} />
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
