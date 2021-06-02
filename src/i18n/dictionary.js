import app from './labels/labels_app';
import header from './labels/labels_header';
import mainscreen from './labels/labels_mainscreen';
import campaignPortal from './labels/labels_campaignPortal';
import listSU from './labels/labels_listSU';
import review from './labels/labels_review';
import monitoringTable from './labels/labels_monitoringTable';
import collectionTable from './labels/labels_collectionTable';
import provisionalStatusTable from './labels/labels_provisionalStatusTable';
import alert from './labels/labels_alert';
import terminated from './labels/labels_terminated';
import notifications from './labels/labels_notifications';
import labelsStates from './labels/labels_states';
import labelsContactOutcomes from './labels/labels_contactOutcomes';
import labelsStateDatas from './labels/labels_stateDatas';
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
  ...provisionalStatusTable,
  ...alert,
  ...terminated,
  ...notifications,
  ...labelsStates,
  ...labelsContactOutcomes,
  ...labelsStateDatas,
  ...close,
};

export default dictionary;
