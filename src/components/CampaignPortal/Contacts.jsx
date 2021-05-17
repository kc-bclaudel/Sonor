import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import D from '../../i18n';

function Contacts() {
  const renderTooltip = (
    <Popover id="popover-basic">
      <Popover.Content>
        {D.sendMail}
      </Popover.Content>
    </Popover>
  );
  return (
    <Card className="ViewCard">
      <div>
        <Card.Title className="Title">{D.contacts}</Card.Title>

        <Table className="CustomTable" bordered striped responsive size="sm">
          <tbody>
            <OverlayTrigger placement="top" overlay={renderTooltip}>
              <tr
                className="Clickable"
                data-testid="mail-button"
                onClick={() => { window.location.assign('mailto:survey@mail.com'); }}
              >
                <th className="ContactsLeftHeader">{D.functionalBox}</th>
                <td className=" LightGreyLine MailLink">survey@mail.com</td>
              </tr>
            </OverlayTrigger>
            <tr>
              <th rowSpan="2" className="VerticallyCentered ContactsLeftHeader">{D.cpos}</th>
              <td className="LightGreyLine">Chloé Dupont</td>
            </tr>
            <tr>
              <td className="LightGreyLine">01 01 01 01 01</td>
            </tr>
            <tr>
              <th rowSpan="2" className="VerticallyCentered ContactsLeftHeader">{D.deputyCpos}</th>
              <td className="LightGreyLine">Thierry Fabres</td>
            </tr>
            <tr>
              <td className="LightGreyLine">02 01 01 01 01</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Card>
  );
}

export default Contacts;
