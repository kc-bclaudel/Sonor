import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import logo from './logo_com_externe_semi_bold.png';
import './Header.css';

class Header extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      toggleFirstMenu: false,
      toggleSecondMenu: false,
    }
  }

  toggleFirstDropDownMenu(e){
    e.stopPropagation();
    this.setState({
      toggleFirstMenu: !this.state.toggleFirstMenu
    })
  }

  toggleSecondDropDownMenu(e) {
    e.stopPropagation();
    this.setState({
     toggleSecondMenu: !this.state.toggleSecondMenu
   })
 }

 displayFirstSubMenu(toggle){
  if(toggle){
    return(
    <ul className="dropdown-menu">
      <li >
        <a onClick={(e)=>{this.toggleSecondDropDownMenu(e)}} className="selectedSubeMenu" href="#" >Enquêtes<i style={{'marginLeft':'40px'}} className="fa fa-caret-right fa-xs"></i></a>
        {this.displaySecondSubMenu(this.state.toggleSecondMenu)}
      </li>
      <li>
        <a onClick={(e)=>{this.toggleSecondDropDownMenu(e)}} id="selectedSubeMenu" className="selectedSubeMenu" href="#" >Enquêteurs<i style={{'marginLeft':'25px'}} className="fa fa-caret-right fa-xs"></i></a>
        {this.displaySecondSubMenu(this.state.toggleSecondMenu)}
      </li>
    </ul>
    );
  }
}

displaySecondSubMenu(toggle){
  if(toggle){
    return(
    <ul className="dropdown-menu sub-menu" id="BtnSuivre"> 
      <li><a onClick={() => this.props.goToMonitoringTable()} className="selectedSubeMenu" href="#">Avancement</a></li>
    </ul>
    );
  }
}

hideMenu(){
  this.setState({
    toggleFirstMenu : false,
    toggleSecondMenu : false,
  })
}

  render(){
    const appVersion = window.configs.appVersion;
    const {
      returnFunc, user, goToMonitoringTable
    } = this.props
    return (
      <header id="App-header" className="shadow">
        <Container fluid>
          <Row onClick={()=> {this.hideMenu()}}>
            <Col md="auto">
              <img
                src={logo}
                id="InseeLogo"
                alt="logo"
                className="Clickable"
                onClick={() => returnFunc()}
              />
              <div style={{'textAlign': 'center', 'fontSize': '0.75rem', 'fontWeight': 'bold', 'color': '#575453'}}>{appVersion}</div>
            </Col>
            <Col>
              <div className="d-inline-flex classTest" id="headerButtonContainer">
                <Button className="HeaderButton">Relancer</Button>
                <li className="dropdown" id="BtnSuivreParent">
                  <Button data-toggle="dropdown" className="HeaderButton dropdown-toggle" href="#" onClick={(e)=>{this.toggleFirstDropDownMenu(e)}}>Suivre <b className="caret"></b></Button>
                  {this.displayFirstSubMenu(this.state.toggleFirstMenu)}
                </li>
                <Button className="HeaderButton">Lire</Button>
              </div>
            </Col>
            <Col><UserZone user={user} date={new Date()} /></Col>
          </Row>
        </Container>
      </header>
    );
  }
}

function UserZone({ user, date }) {
  return (
    <Card id="UserZone">
      <Card.Title>
        { 'Bienvenue '}
        {user.firstname}
        &nbsp;
        {user.lastname}
      </Card.Title>
      <Card.Subtitle className="mb-2 text-muted">{date.toLocaleDateString()}</Card.Subtitle>
      <div className="UserZoneButtons">
        <Button className="HeaderButton">Mes enquêteurs</Button>
        <Button className="HeaderButton">Mes enquêtes</Button>
      </div>
    </Card>
  );
}




  

export default Header;
