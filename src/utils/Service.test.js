// Link.react.test.js
import 'core-js';
import { wait } from '@testing-library/react';
import Service from './Service';
import mocks from '../tests/mock_responses';

const toLocaleDateString = Date.prototype.toLocaleString;
Date.prototype.toLocaleDateString = function() {
  return toLocaleDateString.call(this, 'en-EN', { timeZone: 'UTC',year: "numeric", month: "numeric", day: "numeric" });
};
const OriginalDate = global.Date;
jest
  .spyOn(global, 'Date')
  .mockImplementation((a) => (a ? new OriginalDate(a) : new OriginalDate('2020-08-20T11:01:58.135Z')));
Date.now = jest.fn(() => 1597916474000);

const makeResponse = function(obj){
  const blob = new Blob([JSON.stringify(obj, null, 2)], {type : 'application/json'});

  const init = { "status" : 200 , "statusText" : "SuperSmashingGreat!" };
  return new Response(blob, init);
}

const {
  mainScreenData,
  userData,
  pearlJamMocks,
} = mocks;

const service = new Service();

it('Test option creation', async () => {
  const s = new Service('ABC');
  // Should return correct options
  expect(s.options).toEqual({"headers": {"map": {"authorization": "Bearer ABC", "content-type": "application/json"}}});
});

it('Test getUser', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(userData))),
  );
  service.getUser(cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(userData);
  // Same when using the returned promise
  const res = await service.getUser();
  expect(res).toEqual(userData);

  global.fetch.mockClear();
  delete global.fetch;
});

it('Test putSurveyUnitToValidate', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn(() => (Promise.resolve({ status: 200 })));
  service.putSurveyUnitToValidate(['su'], cb);
  await wait(() => expect(cb).toHaveBeenCalled());

  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith({ status: 200 });
});

it('Test putPreferences', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn(() => (Promise.resolve({ status: 200 })));
  service.putPreferences(['id'], cb);
  await wait(() => expect(cb).toHaveBeenCalled());

  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith({ status: 200 });
});

it('Test getSurveys', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(mainScreenData))),
  );
  service.getSurveys(cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(mainScreenData);
});

it('Test getInterviewers', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.interviewersByCampaign))),
  );
  service.getInterviewers('id', cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.interviewersByCampaign);
});

it('Test getNotAttributedByCampaign', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.notAttributed))),
  );
  service.getNotAttributedByCampaign('id', cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.notAttributed);
});

it('Test getAbandonedByCampaign', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.abandoned))),
  );
  service.getAbandonedByCampaign('id', cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.abandoned);
});

it('Test getTerminatedByCampaign', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.terminated))),
  );
  service.getTerminatedByCampaign('id', cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.terminated);
});

it('Test getStatesBySurveyId', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.states))),
  );
  service.getStatesBySurveyId('id', cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.states);
});

it('Test getTotalDemByCampaign', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.stateCountTotal))),
  );
  service.getTotalDemByCampaign('id', cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.stateCountTotal);
});

it('Test getSurveyUnits', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.surveyUnits))),
  );
  service.getSurveyUnits('id', 'FIN', cb);
  service.getSurveyUnits('id', null, cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.surveyUnits);


});

it('Test getInterviewersStateCount', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.interviewerStateCount))),
  );
  service.getInterviewersStateCount('id','idep', null, cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.interviewerStateCount);
});

it('Test getStateCount', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.stateCountTotal))),
  );
  service.getStateCount('id', null, cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.stateCountTotal);
});
