import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { Transition } from 'react-transition-group';

class AlertContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: {} };
  }

  componentDidUpdate(nextProps) {
    const { show } = this.state;
    if (nextProps.alerts.some((alert) => show[alert.id] === undefined)) {
      const newShow = show;
      nextProps.alerts.forEach((alert) => {
        if (newShow[alert.id] === undefined) {
          newShow[alert.id] = true;
        }
      });
      this.setState({ show: newShow });
    }
  }

  hide(id) {
    const { show } = this.state;
    const newShow = show;
    newShow[id] = false;
    this.setState({ show: newShow });
  }

  displayAlerts() {
    const { alerts } = this.props;
    const { show } = this.state;
    const alertsToDisplay = [];

    const duration = 300;

    const defaultStyle = {
      transition: `opacity ${duration}ms ease-in-out, left ${duration}ms ease-in-out`,
      opacity: 0,
      left: '-100%',
    };

    const timeout = {
      appear: 0,
      enter: 0,
      exit: duration,
    };

    const transitionStyles = {
      entering: { opacity: 0 },
      entered: { opacity: 0.94, left: 0 },
      exiting: { opacity: 0, left: 0 },
      exited: { opacity: 0, left: 0 },
    };

    alerts.forEach((alert) => {
      const heading = alert.heading ? (<Alert.Heading>{alert.heading}</Alert.Heading>) : null;
      const text = alert.text ? (<p>{alert.text}</p>) : null;
      alertsToDisplay.push(
        <Transition in={show[alert.id]} timeout={timeout} key={alert.id} unmountOnExit>
          {(state) => (
            <Alert
              style={{
                ...defaultStyle,
                ...transitionStyles[state],
              }}
              key={alert.id}
              variant={alert.variant}
              onClose={() => this.hide(alert.id)}
              dismissible
            >
              {heading}
              {text}
            </Alert>
          )}
        </Transition>,
      );
    });
    return alertsToDisplay;
  }

  render() {
    return (
      <div id="AlertContainer">
          {this.displayAlerts()}
      </div>
    );
  }
}

export default AlertContainer;
