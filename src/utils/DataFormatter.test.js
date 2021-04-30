// Link.react.test.js
import 'core-js';
import { wait } from '@testing-library/react';
import DataFormatter from './DataFormatter';
import Service from './Service';
import mocks from '../tests/mocks';
import C from './constants.json';
import Utils from './Utils';

const OriginalDate = global.Date;
jest
  .spyOn(global, 'Date')
  .mockImplementation((a) => (a ? new OriginalDate(a) : new OriginalDate('2020-08-20T11:01:58.135Z')));
Date.now = jest.fn(() => 1597916474000);

jest.mock('./Service');

const {
  mainScreenData,
  userData,
  preferences,
  campaignPortalData2,
  formattedSurveys,
  pearlJamMocks,
  formattedReviewData,
  formattedDataMonitoringTableByInterv,
  formattedDataMonitoringTableByInterv1surv,
  formattedDataMonitoringTableBysurvey,
  formattedDataMonitoringTableBySite,
  formattedListSuData,
  formattedSuTerminated,
  formattedLisSuToReviewSimpsons,
  mainScreenData1Survey,
  surveyVqs,
} = mocks;

Service.mockImplementation(() => ({
  getUser: jest.fn((cb) => {
    if (cb) { cb(userData); }
    return Promise.resolve(userData);
  }),
  putSurveyUnitToValidate: jest.fn((su, cb) => (cb({ status: 200 }))),
  putPreferences: jest.fn((prefs, cb) => (cb({ status: 200 }))),
  getQuestionnaireId: jest.fn((id, c) => (c({ questionnaireId: 'QXT55' }))),
  getCampaigns: jest.fn((cb) => (cb(mainScreenData))),
  getInterviewersByCampaign: jest.fn((id, cb) => (cb(pearlJamMocks.interviewersByCampaign))),
  getInterviewers: jest.fn((cb) => (cb(pearlJamMocks.interviewers))),
  getSurveyUnitsNotAttributedByCampaign: jest.fn((id, cb) => (cb(pearlJamMocks.notAttributed))),
  getSurveyUnitsAbandonedByCampaign: jest.fn((id, cb) => (cb(pearlJamMocks.abandoned))),
  getTerminatedByCampaign: jest.fn(
    (id, cb) => {
      (cb(Utils.sortData(pearlJamMocks.terminated, 'finalizationDate', true)));
      resolve(Utils.sortData(processedData, 'finalizationDate', true));
    }
  ),
  getSurveyUnitsClosable: jest.fn((cb) => (cb(pearlJamMocks.surveyUnitsClosable))),
  getStatesBySurveyUnit: jest.fn((id, cb) => (cb(pearlJamMocks.states))),
  getStateCountTotalByCampaign: jest.fn((id, cb) => (cb(pearlJamMocks.stateCountTotal))),
  getSurveyUnits: jest.fn((id, state, cb) => {
    if (cb) {
      cb(pearlJamMocks.surveyUnits);
    }
    return new Promise((resolve) => { resolve(pearlJamMocks.surveyUnits); });
  }),
  getStateCountByInterviewer: jest.fn((id, idep, date, cb) => {
    if (cb) {
      cb(pearlJamMocks.interviewerStateCount);
    }
    return new Promise((resolve) => { resolve(pearlJamMocks.interviewerStateCount); });
  }),
  getCampaignsByInterviewer: jest.fn((idep, cb) => {
    if (cb) {
      cb(pearlJamMocks.campaignsByInterviewer);
    }
    return new Promise((resolve) => { resolve(pearlJamMocks.campaignsByInterviewer); });
  }),
  getStateCount: jest.fn((id, date, cb) => (cb(pearlJamMocks.stateCountTotal))),
  getStateCountByCampaign: jest.fn((date, cb) => (cb(pearlJamMocks.stateCountByCampaign))),
  getStateCountByInterviewers: jest.fn((date, cb) => {
    if (cb) {
      cb(pearlJamMocks.stateCountByInterv);
    }
    return new Promise((resolve) => { resolve(pearlJamMocks.stateCountByInterv); });
  }),
}));

const dataRetreiver = new DataFormatter();
it('Test getInterviewers', async () => {
  const callBack = jest.fn();
  dataRetreiver.getInterviewers(callBack);
  // Should return properly formatted data
  expect(callBack).toHaveBeenLastCalledWith(pearlJamMocks.interviewers);
});

it('Test getUserInfo', async () => {
  const callBack = jest.fn();
  dataRetreiver.getUserInfo(callBack);
  // Should return properly formatted data
  expect(callBack).toHaveBeenLastCalledWith(userData);
});

it('Test getPreferences', async () => {
  const callBack = jest.fn();
  dataRetreiver.getPreferences(callBack);
  // Should return properly formatted data
  await wait(() => expect(callBack).toHaveBeenLastCalledWith(preferences));
  // Same when using the returned promise
  const res = await dataRetreiver.getPreferences();
  expect(res).toEqual(preferences);
});

it('Test updatePreferences', async () => {
  const callBack = jest.fn();
  dataRetreiver.updatePreferences(['id'], callBack);
  await wait(() => expect(callBack).toHaveBeenCalled());
  // Should return properly formatted data
  expect(callBack).toHaveBeenLastCalledWith({ status: 200 });
  // Same when using the returned promise
  const res = await dataRetreiver.updatePreferences(['id']);
  expect(res).toEqual({ status: 200 });
});

it('Test getDataForCampaignPortal', async () => {
  const callBack = jest.fn();
  dataRetreiver.getDataForCampaignPortal('id', callBack);
  await wait(() => expect(callBack).toHaveBeenCalled());
  // Should return properly formatted data
  expect(callBack).toHaveBeenLastCalledWith(campaignPortalData2);
});

it('Test getDataForMainScreen', async () => {
  const callBack = jest.fn();
  dataRetreiver.getDataForMainScreen(null, callBack);
  // Should return properly formatted data
  expect(callBack).toHaveBeenLastCalledWith(formattedSurveys);
});

it('Test getDataForClosePage', async () => {
  const callBack = jest.fn();
  dataRetreiver.getDataForClosePage(callBack);
  // Should return properly formatted data
  expect(callBack).toHaveBeenLastCalledWith(pearlJamMocks.surveyUnitsClosable);
});

it('Test getDataForListSU', async () => {
  const callBack = jest.fn();
  dataRetreiver.getDataForListSU('id', callBack);
  await wait(() => expect(callBack).toHaveBeenCalled());
  // Should return properly formatted data
  expect(callBack).toHaveBeenLastCalledWith(formattedListSuData);
});

it('Test getDataForReview', async () => {
  const callBack = jest.fn();
  dataRetreiver.getDataForReview(null, callBack);
  await wait(() => expect(callBack).toHaveBeenCalled());
  // Should return properly formatted data
  expect(callBack.mock.calls[0][0].map((a) => a.id).sort())
    .toEqual(formattedReviewData.map((a) => a.id).sort());
});

it('Test getListSuTerminated', async () => {
  const callBack = jest.fn();
  dataRetreiver.getListSuTerminated('id', callBack);
  await wait(() => expect(callBack).toHaveBeenCalled());
  // Should return properly formatted data
  expect(callBack).toHaveBeenLastCalledWith(formattedSuTerminated);
});

it('Test getDataForMonitoringTable (by interviewer 1 survey)', async () => {
  const callBack = jest.fn();
  dataRetreiver.getDataForMonitoringTable(surveyVqs, new Date('2020-08-20T11:01:58.135Z'), null, C.BY_INTERVIEWER_ONE_SURVEY, callBack);
  await wait(() => expect(callBack).toHaveBeenCalled());
  // Should return properly formatted data
  expect(callBack).toHaveBeenLastCalledWith(formattedDataMonitoringTableByInterv1surv);
});

it('Test getDataForMonitoringTable (by survey 1 Interviewer)', async () => {
  const callBack = jest.fn();
  dataRetreiver.getDataForMonitoringTable(mainScreenData1Survey, new Date('2020-08-20T11:01:58.135Z'), null, C.BY_SURVEY_ONE_INTERVIEWER, callBack);
  await wait(() => expect(callBack).toHaveBeenCalled());
  // Should return properly formatted data
  expect(callBack).toHaveBeenCalledWith(formattedDataMonitoringTableByInterv);
});

it('Test getDataForMonitoringTable (by survey)', async () => {
  const callBack2 = jest.fn();
  const dataRet = new DataFormatter();
  dataRet.getDataForMonitoringTable(mainScreenData1Survey, new Date('2020-08-20T11:01:58.135Z'), null, C.BY_SURVEY, callBack2);
  await wait(() => expect(callBack2).toHaveBeenCalled());
  // Should return properly formatted data
  expect(callBack2).toHaveBeenCalledWith(formattedDataMonitoringTableBysurvey);
});

it('Test getDataForMonitoringTable (by site)', async () => {
  const callBack = jest.fn();
  dataRetreiver.getDataForMonitoringTable(formattedSurveys, new Date('2020-08-20T11:01:58.135Z'), null, C.BY_SITE, callBack);
  await wait(() => expect(callBack).toHaveBeenCalled());
  // Should return properly formatted data
  expect(callBack).toHaveBeenLastCalledWith(formattedDataMonitoringTableBySite);
});

it('Test getStatesSurvey', async () => {
  const callBack = jest.fn();
  dataRetreiver.getStatesSurvey('id', callBack);
  await wait(() => expect(callBack).toHaveBeenCalled());
  // Should return properly formatted data
  expect(callBack).toHaveBeenLastCalledWith(pearlJamMocks.states.states);
  // Same when using the returned promise
  const res = await dataRetreiver.getStatesSurvey('id');
  expect(res).toEqual(pearlJamMocks.states.states);
});

it('Test finalizeSurveyUnits', async () => {
  const callBack = jest.fn();
  dataRetreiver.finalizeSurveyUnits(['id'], callBack);
  await wait(() => expect(callBack).toHaveBeenCalled());
  // Should return properly formatted data
  expect(callBack).toHaveBeenLastCalledWith([{ status: 200 }]);
  // Same when using the returned promise
  const res = await dataRetreiver.finalizeSurveyUnits(['id']);
  expect(res).toEqual([{ status: 200 }]);
});

it('Test getListSUToReview', async () => {
  const res = await dataRetreiver.getListSUToReview('simpsons2020x00');
  // Should return properly formatted data
  expect(res.map((a) => a.id).sort())
    .toEqual(formattedLisSuToReviewSimpsons.map((a) => a.id).sort());
});

// getInterviewers
// updateSurveyUnitsState
// closeSurveyUnits
// tagWithClosingCauseSurveyUnits
// updateSurveyUnitsComment
// updateSurveyUnitViewed
// getlinesDetails
// getSurveyByInterviewerDataForMonitoringTable
// getDataForCollectionTableBySurvey
// getDataForCollectionTableByInterviewerOneSuvey
// getDataForCollectionTableBySurveyOneInterviewer
// getDataForCollectionTableBySite
// getDataForCollectionTable
// postMessage
// verifyName
// getMessageHistory
