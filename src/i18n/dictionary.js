import app from './labels/labels_app';
import header from './labels/labels_header';
import mainscreen from './labels/labels_mainscreen';
import campaignPortal from './labels/labels_campaignPortal';
import listSU from './labels/labels_listSU';
import monitoringTable from './labels/labels_monitoringTable';

const dictionary = {
  ...app,
  ...header,
  ...mainscreen,
  ...campaignPortal,
  ...listSU,
  ...monitoringTable,
};

export default dictionary;
