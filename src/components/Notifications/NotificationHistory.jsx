import React, { useState } from 'react';
import './Notifications.css';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import PaginationNav from '../PaginationNav/PaginationNav';
import D from '../../i18n';

function NotificationHistory({ setMessageView, messageHistory }) {
  const [pagination, setPagination] = useState({ size: 10, page: 1 });

  return (
    <Card id="NotificationHistory">
      <Card.Title>{D.history}</Card.Title>
      <Table id="messageHistory" className="CustomTable" bordered striped hover responsive size="sm">
        <tbody>
          {messageHistory.slice(
            (pagination.page - 1) * pagination.size,
            Math.min(pagination.page * pagination.size, messageHistory.length),
          ).map((msg) => (
            <tr
              key={msg.id}
              className="HistoryLine"
              onClick={() => {
                setMessageView(msg);
              }}
            >
              <td className="time">
                {`${new Date(msg.date).toLocaleDateString().slice(0, 5)} ${(`0${new Date(msg.date).getHours()}`).slice(-2)}h${(`0${new Date(msg.date).getMinutes()}`).slice(-2)}`}
              </td>

              <td className="recipients">
                <b>
                  {`${D.to}: `}
                </b>
                {msg.typedRecipients.map((r) => `@${r.id}${r.label ? ` (${r.label.length < 20 ? r.label : `${r.label.slice(0, 20)}...`})` : ''}`)
                  .join(', ')}
              </td>
              <td>
                {msg.text.split(/\n\r?/g)
                  .map((line, index) => (index ? (
                    <>
                      <br />
                      {line}
                    </>
                  ) : line))}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="tableOptionsWrapper">
        <PaginationNav.PageSelector
          pagination={pagination}
          updateFunc={(newPagination) => { setPagination(newPagination); }}
          numberOfItems={messageHistory.length}
        />
      </div>
    </Card>
  );
}

export default NotificationHistory;
