import React from 'react';
import './Notifications.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import NotificationHistory from './NotificationHistory';
import NotificationSender from './NotificationSender';
import MessageModal from './MessageModal';
import D from '../../i18n';
import 'react-bootstrap-typeahead/css/Typeahead.css';

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipients: '',
      messageHistory: [],
      messageView: null,
    };
    this.textWidth = React.createRef();
  }

  componentDidMount() {
    this.getMessageHistory();
  }

  getMessageHistory() {
    const { dataRetreiver } = this.props;
    dataRetreiver.getMessageHistory((res) => {
      this.setState({ messageHistory: res.reverse() });
    });
  }

  setMessageView(msg) {
    this.setState({ messageView: msg });
  }

  render() {
    const {
      recipients, messageView, messageHistory,
    } = this.state;
    const { dataRetreiver, user } = this.props;
    return (
      <>
        <div id="Container">
          <Link to="/" className="ButtonLink ReturnButtonLink">
            <Button id="notificationReturnButton" className="ReturnButton" data-testid="return-button">{D.back}</Button>
          </Link>
          <Card id="mainCard">
            <Col id="mailCardCol">
              <NotificationSender
                fetchMessageHistory={() => this.getMessageHistory()}
                dataRetreiver={dataRetreiver}
                sender={user.id}
              />
            </Col>
            <Col id="historyCol">
              <NotificationHistory
                setMessageView={(msg) => this.setMessageView(msg)}
                messageHistory={messageHistory}
              />
            </Col>
          </Card>
          <div ref={this.textWidth} className="textwidth">{recipients}</div>
        </div>
        <MessageModal
          messageView={messageView}
          setMessageView={(msg) => this.setMessageView(msg)}
        />
      </>
    );
  }
}

export default Notifications;
