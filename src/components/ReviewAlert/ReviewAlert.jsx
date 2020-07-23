import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import D from '../../i18n';

function ReviewAlert({ data }) {
  const [show, setShow] = useState(true);
  let alerte = {};
  if (data.lstSUFinalized !== null && show) {
    if (data.errorOccurred) {
      alerte = (
        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
          <p>
            {D.reviewAlertSuccess}
          </p>
        </Alert>
      );
    } else {
      alerte = (
        <Alert variant="success" onClose={() => setShow(false)} dismissible>
          <p>
            {D.reviewAlertSuccess}
            [
            {data.lstSUFinalized.toString()}
            ]
          </p>
        </Alert>
      );
    }
    return alerte;
  }
  return '';
}
export default ReviewAlert;
