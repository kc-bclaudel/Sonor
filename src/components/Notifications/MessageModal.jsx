import React from 'react';
import './Notifications.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import D from '../../i18n';
import 'react-bootstrap-typeahead/css/Typeahead.css';

function MessageModal({ messageView, setMessageView }) {
  return (
    <Modal
      show={messageView !== null}
      onHide={() => setMessageView(null)}
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
            {
            messageView
              ? messageView.text.split(/\n\r?/g)
                .map((line, index) => (index ? (
                  <>
                    <br />
                    {line}
                  </>
                ) : line))
              : ''
            }
          </Modal.Body>
          <Modal.Footer>
            <Button
              data-testid="close-preferences-button"
              onClick={() => setMessageView(null)}
            >
              OK
            </Button>
          </Modal.Footer>
        </>
      ) : null}
    </Modal>
  );
}

export default MessageModal;
