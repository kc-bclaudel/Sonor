import app from './labels/labels_app';
import header from './labels/labels_header';
import mainscreen from './labels/labels_mainscreen';
import campaignPortal from './labels/labels_campaignPortal';
import listSU from './labels/labels_listSU';
import review from './labels/labels_review';
import monitoringTable from './labels/labels_monitoringTable';
import collectionTable from './labels/labels_collectionTable';
import alert from './labels/labels_alert';
import terminated from './labels/labels_terminated';
import notifications from './labels/labels_notifications';
import labeles_states from './labels/labels_states';
import close from './labels/labels_close';

const dictionary = {
  ...app,
  ...header,
  ...mainscreen,
  ...campaignPortal,
  ...listSU,
  ...review,
  ...monitoringTable,
  ...collectionTable,
  ...alert,
  ...terminated,
  ...notifications,
  ...labeles_states,
  ...close,
};

export default dictionary;
