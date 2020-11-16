import React from 'react';
import './Notifications.css';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import PaginationNav from '../PaginationNav/PaginationNav';
import D from '../../i18n';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Fragment } from 'react';

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      recipients: '',
      pagination: { size: 10, page: 1 },
      options: [],
      isLoading: false,
      messageHistory: [],
      messageView: null,
    };

    this.recipientsInput = React.createRef();
    this.badgeContainer = React.createRef();
    this.lastBadgeLine = React.createRef();
    this.textWidth = React.createRef();
    this.typehead = React.createRef();
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

  sendMessage() {
    const { message, recipients } = this.state;
    const { dataRetreiver } = this.props;
    dataRetreiver.postMessage({ text: message, recipients }, () => {
      this.getMessageHistory();
    });
    this.typehead.current.clear();
    this.setState({
      message: '',
      recipients: '',
    });
  }

  updateRecipients(e) {
    this.setState({ recipients: e.map((item) => item.id) });
  }

  handleSearch(query) {
    const { dataRetreiver } = this.props;
    this.setState({ isLoading: true });
    dataRetreiver.verifyName(query.replace('@', ''), (res) => {
      res.push({ id: 'All' });
      const options = res;
      this.setState({ options, isLoading: false });
    });
  }

  updateMessage(e) {
    this.setState({ message: e.target.value });
  }

  handlePageChange(pagination) {
    this.setState({ pagination });
  }

  render() {
    const {
      message, recipients, options, isLoading, messageHistory, pagination, messageView,
    } = this.state;
    return (
      <>
        <div id="Container">
          <Card id="mainCard">
            <Container fluid>
              <Row>
                <Col id="mailCardCol">
                  <Card id="mailCard">
                    <Card.Title>{D.notify}</Card.Title>
                    <span>{`${D.recipients}: `}</span>
                    <div id="recipientWrapper">
                      <AsyncTypeahead
                        id="async-typehead"
                        isLoading={isLoading}
                        ref={this.typehead}
                        labelKey={(option) => `@${option.id}${option.label ? ` (${option.label.length < 20 ? option.label : `${option.label.slice(0, 20)}...`})` : ''}`}
                        minLength={3}
                        onSearch={(q) => this.handleSearch(q)}
                        options={options.slice(0, options.length)}
                        renderMenuItemChildren={(option) =>(
                          <Fragment>
                            <span>{`${option.id}${option.label ? ` (${option.label})` : ''}`}</span>
                          </Fragment>
                        )}
                        multiple
                        size="small"
                        onChange={(e) =>{this.updateRecipients(e)}}
                      />
                    </div>
                    <span>{`${D.message}: `}</span>
                    <textarea
                      type="textarea"
                      id="message"
                      value={message}
                      onChange={(e) => this.updateMessage(e)}
                    />
                    <Button id="sendButton" onClick={() => this.sendMessage()}>
                      <i className="fa fa-fw fa-paper-plane" />
                      &nbsp;
                      {D.send}
                    </Button>
                  </Card>
                </Col>
                <Col>
                  <Card id="NotificationHistory">
                    <Card.Title>{D.history}</Card.Title>
                    <Table id="messageHistory" className="CustomTable" bordered striped hover responsive size="sm">
                      <tbody>
                        {messageHistory.slice(
                          (pagination.page - 1) * pagination.size,
                          Math.min(pagination.page * pagination.size, messageHistory.length),
                        ).map((msg) => (
                          <tr
                            onClick={() => {
                              this.setState({ messageView: msg });
                            }}
                          >
                            <td className="time">{`${new Date(msg.date).toLocaleDateString().slice(0, 5)} ${(`0${new Date(msg.date).getHours()}`).slice(-2)}h${(`0${new Date(msg.date).getMinutes()}`).slice(-2)}`}</td>
                            <td className="sender">
                              <b>
                                {`${D.from}: `}
                              </b>
                              {msg.sender}
                            </td>
                            <td className="recipients">
                              <b>
                                {`${D.to}: `}
                              </b>
                              {msg.typedRecipients.map((r) => `@${r.id}${r.label ? ` (${r.label.length < 20 ? r.label : `${r.label.slice(0, 20)}...`})` : ''}`)
                                .join(', ')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <div className="tableOptionsWrapper">
                      <PaginationNav.PageSelector
                        pagination={pagination}
                        updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
                        numberOfItems={messageHistory.length}
                      />
                    </div>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Card>
          <div ref={this.textWidth} className="textwidth">{recipients}</div>
        </div>
        <Modal
          show={messageView !== null}
          onHide={() => this.setState({ messageView: null })}
        >
          { messageView ? (
            <>
              <Modal.Header closeButton>
                <Modal.Title>
                  <div>
                    {`${new Date(messageView.date).toLocaleDateString().slice(0, 5)} ${(`0${new Date(messageView.date).getHours()}`).slice(-2)}h${(`0${new Date(messageView.date).getMinutes()}`).slice(-2)}`}
                  </div>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <b>
                    {`${D.from}: `}
                  </b>
                  {messageView.sender}
                </div>
                <hr />
                <div>
                  <b>
                    {`${D.to}: `}
                  </b>
                  {messageView.typedRecipients.map((r) => `@${r.id}${r.label ? ` (${r.label.length < 20 ? r.label : `${r.label.slice(0, 20)}...`})` : ''}`)
                    .join(', ')}
                </div>
                <hr />
                {messageView ? messageView.text : ''}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  data-testid="close-preferences-button"
                  onClick={() => this.setState({ messageView: null })}
                >
                  OK
                </Button>
              </Modal.Footer>
            </>
          ) : null}
        </Modal>
      </>
    );
  }
}

export default Notifications;
