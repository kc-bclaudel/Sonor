import React from 'react';
import Alert from 'react-bootstrap/Alert';

class AlertContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: [] };
  }

  componentDidUpdate(nextProps) {
    const { show } = this.state;
    const diff = nextProps.alerts.length - show.length;
    if (diff > 0) {
      const newShow = show;
      for (let i = 0; i < diff + 1; i += 1) {
        newShow.push(true);
      }
      this.setState({ show: newShow });
    }
  }

  hide(index) {
    const { show } = this.state;
    const newShow = show;
    newShow[index] = false;
    this.setState({ show: newShow });
  }

  displayAlerts() {
    const { alerts } = this.props;
    const { show } = this.state;
    const alertsToDisplay = [];
    alerts.forEach((alert, index) => {
      const heading = alert.heading ? (<Alert.Heading>{alert.heading}</Alert.Heading>) : null;
      const text = alert.text ? (<p>{alert.text}</p>) : null;
      alertsToDisplay.push(
        <Alert
          key={index}
          show={show[index]}
          variant={alert.variant}
          onClose={() => this.hide(index)}
          dismissible
        >
          {heading}
          {text}
        </Alert>,
      );
    });
    return alertsToDisplay;
  }

  render() {
    const { alerts } = this.props;
    return (
      <div id="AlertContainer">
        {this.displayAlerts(alerts, this.hide)}
      </div>
    );
  }
}

export default AlertContainer;
