import React from 'react';
import logo from './logo.jpeg';



class Header extends React.Component {

  render() {
    return (
      <header id='App-header'>
        <img src={logo} id='InseeLogo' alt='logo' />
        <button className='HeaderButton RedButton'>Affecter</button>
        <button className='HeaderButton RedButton'>Suivre</button>
        <button className='HeaderButton RedButton'>Contrôler</button>
        <UserZone userName={this.props.keycloak.idTokenParsed.name} date='08/06/2020'/>
      </header>
    );
  }
}

class UserZone extends React.Component {

  render() {
    return (
      <div id='UserZone'>
        <div>Bienvenue {this.props.userName}</div>
        <div>{this.props.date}</div>
        <div className='UserZoneButtons'>
          <button className='HeaderButton YellowButton'>Mes enquêteurs</button>
          <button className='HeaderButton YellowButton'>Mes enquêtes</button>
        </div>
      </div>
    );
  }
}


export default Header;
