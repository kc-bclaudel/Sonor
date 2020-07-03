import React from 'react';
import View from './View.js'
import Header from './Header.js'
import './App.css';
import Keycloak from 'keycloak-js';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { keycloak: null, authenticated: false };
  }

  componentDidMount() {
    const keycloak = Keycloak('/keycloak.json');
    keycloak.init({onLoad: 'login-required'}).then(authenticated => {
      this.setState({ keycloak: keycloak, authenticated: authenticated})
    })
  }


  render(){

    if (this.state.keycloak) {
      if (this.state.authenticated){
        return (
          <div className='App'>
            <Header keycloak={this.state.keycloak}/>
            <View currentView='mainScreen' keycloak={this.state.keycloak}/>
          </div>
        );
      }
      else return (<div>Unable to authenticate!</div>)
    }
    return (
      <div>Initializing Keycloak...</div>
    );
  }
}

export default App;
