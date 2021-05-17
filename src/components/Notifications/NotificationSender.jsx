import React, { useState, useRef } from 'react';
import './Notifications.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import D from '../../i18n';
import 'react-bootstrap-typeahead/css/Typeahead.css';

function NotificationSender({ dataRetreiver, fetchMessageHistory, sender }) {
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const typehead = useRef(null);

  function sendMessage() {
    dataRetreiver.postMessage({ text: message, recipients, sender }, () => {
      fetchMessageHistory();
    });
    typehead.current.clear();
    setMessage('');
    setRecipients('');
  }

  function updateRecipients(e) {
    setRecipients(e.map((item) => item.id));
  }

  function handleSearch(query) {
    setIsLoading(true);
    dataRetreiver.verifyName(query.replace('@', ''), (res) => {
      res.push({ id: D.notifyAll });
      setOptions(res);
      setIsLoading(false);
    });
  }

  function updateMessage(e) {
    setMessage(e.target.value);
  }

  return (
    <Card id="mailCard">
      <Card.Title>{D.notifyInterviewers}</Card.Title>
      <span>{`${D.recipients} : `}</span>
      <div id="recipientWrapper">
        <AsyncTypeahead
          id="async-typehead"
          data-testid="recipients-field"
          isLoading={isLoading}
          ref={typehead}
          labelKey={
            (option) => `@${option.id}${option.label
              ? ` (${option.label.length < 20 ? option.label
                : `${option.label.slice(0, 20)}...`})` : ''}`
          }
          minLength={1}
          onSearch={(q) => handleSearch(q)}
          onInputChange={ (text, e) => {
            handleSearch(text)
          }}
          options={options.slice(0, options.length)}
          renderMenuItemChildren={(option) => (
            <span>{`${option.id}${option.label ? ` (${option.label})` : ''}`}</span>
          )}
          multiple
          size="small"
          onChange={(e) => { updateRecipients(e); }}
        />
      </div>
      <span>{`${D.message} : `}</span>
      <textarea
        type="textarea"
        id="message"
        value={message}
        onChange={(e) => updateMessage(e)}
      />
      <Button id="sendButton" onClick={() => sendMessage()}>
        <i className="fa fa-fw fa-paper-plane" />
        &nbsp;
        {D.send}
      </Button>
    </Card>
  );
}

export default NotificationSender;
