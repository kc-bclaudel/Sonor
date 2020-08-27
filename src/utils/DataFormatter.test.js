// Link.react.test.js
import 'core-js';
import { wait } from '@testing-library/react';
import DataFormatter from './DataFormatter';
import Service from './Service';
import mocks from '../tests/mock_responses';
import C from './constants.json';

const toLocaleDateString = Date.prototype.toLocaleString;
Date.prototype.toLocaleDateString = function() {
  return toLocaleDateString.call(this, 'en-EN', { timeZone: 'UTC',year: "numeric", month: "numeric", day: "numeric" });
};
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
  getSurveys: jest.fn((cb) => (cb(mainScreenData))),
  getInterviewers: jest.fn((id, cb) => (cb(pearlJamMocks.interviewersByCampaign))),
  getNotAttributedByCampaign: jest.fn((id, cb) => (cb(pearlJamMocks.notAttributed))),
  getAbandonedByCampaign: jest.fn((id, cb) => (cb(pearlJamMocks.abandoned))),
  getTerminatedByCampaign: jest.fn((id, cb) => (cb(pearlJamMocks.terminated))),
  getStatesBySurveyId: jest.fn((id, cb) => (cb(pearlJamMocks.states))),
  getTotalDemByCampaign: jest.fn((id, cb) => (cb(pearlJamMocks.stateCountTotal))),
  getSurveyUnits: jest.fn((id, date, cb) => (cb(pearlJamMocks.surveyUnits))),
  getInterviewersStateCount: jest.fn(
    (id, idep, date, cb) => (cb(pearlJamMocks.interviewerStateCount)),
  ),
  getStateCount: jest.fn((id, date, cb) => (cb(pearlJamMocks.stateCountTotal))),
}));

const dataRetreiver = new DataFormatter();

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

it('Test getDataForMainScreen', async () => {
  const callBack = jest.fn();
  dataRetreiver.getDataForMainScreen(null, callBack);
  // Should return properly formatted data
  expect(callBack).toHaveBeenLastCalledWith(formattedSurveys);
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

it('Test getDataForMonitoringTable (by interviewer 1 survey)', async () => {
  const callBack = jest.fn();
  dataRetreiver.getDataForMonitoringTable(surveyVqs, new Date('2020-08-20T11:01:58.135Z'), null, C.BY_INTERVIEWER_ONE_SURVEY, callBack);
  await wait(() => expect(callBack).toHaveBeenCalled());
  // Should return properly formatted data
  expect(callBack).toHaveBeenLastCalledWith(formattedDataMonitoringTableByInterv1surv);
});

it('Test getDataForMonitoringTable (by interviewer)', async () => {
  const callBack = jest.fn();
  dataRetreiver.getDataForMonitoringTable(mainScreenData1Survey, new Date('2020-08-20T11:01:58.135Z'), null, C.BY_INTERVIEWER, callBack);
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

it('Test getDataForCampaignPortal', async () => {
  const callBack = jest.fn();
  dataRetreiver.getDataForCampaignPortal('id', callBack);
  await wait(() => expect(callBack).toHaveBeenCalled());
  // Should return properly formatted data
  expect(callBack).toHaveBeenLastCalledWith(campaignPortalData2);
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

it('Test getListSuTerminated', async () => {
  const callBack = jest.fn();
  dataRetreiver.getListSuTerminated('id', callBack);
  await wait(() => expect(callBack).toHaveBeenCalled());
  // Should return properly formatted data
  expect(callBack).toHaveBeenLastCalledWith(formattedSuTerminated);
  // Same when using the returned promise
  const res = await dataRetreiver.getListSuTerminated('id');
  expect(res).toEqual(formattedSuTerminated);
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
