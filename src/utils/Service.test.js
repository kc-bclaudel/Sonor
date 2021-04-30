// Link.react.test.js
import 'core-js';
import { wait } from '@testing-library/react';
import Service from './Service';
import mocks from '../tests/mocks';

const OriginalDate = global.Date;
jest
  .spyOn(global, 'Date')
  .mockImplementation((a) => (a ? new OriginalDate(a) : new OriginalDate('2020-08-20T11:01:58.135Z')));
Date.now = jest.fn(() => 1597916474000);

const makeResponse = function (obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const init = { status: 200 };
  return new Response(blob, init);
};

const {
  mainScreenData,
  userData,
  campaignsByInterviewer,
  pearlJamMocks,
} = mocks;

const service = new Service();

it('Test option creation', async () => {
  const s = new Service({ token: 'ABC' });
  // Should return correct options
  expect(s.makeOptions()).toEqual({ headers: { map: { authorization: 'Bearer ABC', 'content-type': 'application/json' } } });
});

// -------------------------- //
// Survey-Units service begin //
// -------------------------- //
// getSurveyUnits
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

// getSurveyUnitsClosable
it('Test getSurveyUnitsClosable', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.surveyUnitsClosable))),
  );
  service.getSurveyUnitsClosable(cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.surveyUnitsClosable);
});

// getSurveyUnitsNotAttributedByCampaign
it('Test getSurveyUnitsNotAttributedByCampaign', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.notAttributed))),
  );
  service.getSurveyUnitsNotAttributedByCampaign('id', cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.notAttributed);
});

// getSurveyUnitsAbandonedByCampaign
it('Test getSurveyUnitsAbandonedByCampaign', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.abandoned))),
  );
  service.getSurveyUnitsAbandonedByCampaign('id', cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.abandoned);
});

// getStatesBySurveyUnit
it('Test getStatesBySurveyUnit', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.states))),
  );
  service.getStatesBySurveyUnit('id', cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.states);
});

// putSurveyUnitToValidate
it('Test putSurveyUnitToValidate', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn(() => (Promise.resolve({ status: 200 })));
  service.putSurveyUnitToValidate(['su'], cb);
  await wait(() => expect(cb).toHaveBeenCalled());

  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith({ status: 200 });
});

// putSurveyUnitStateToChange
it('Test putSurveyUnitStateToChange', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn(() => (Promise.resolve({ status: 200 })));
  service.putSurveyUnitStateToChange(['su'], 'FIN', cb);
  await wait(() => expect(cb).toHaveBeenCalled());

  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith({ status: 200 });
});

// putSurveyUnitClose
it('Test putSurveyUnitClose', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn(() => (Promise.resolve({ status: 200 })));
  service.putSurveyUnitClose(['su'], 'closingCause', cb);
  await wait(() => expect(cb).toHaveBeenCalled());

  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith({ status: 200 });
});

// putSurveyUnitClosingCause
it('Test putSurveyUnitClosingCause', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn(() => (Promise.resolve({ status: 200 })));
  service.putSurveyUnitClosingCause(['su'], 'closingCause', cb);
  await wait(() => expect(cb).toHaveBeenCalled());

  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith({ status: 200 });
});

// putSurveyUnitComment
it('Test putSurveyUnitComment', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn(() => (Promise.resolve({ status: 200 })));
  service.putSurveyUnitComment(['su'], '{\'comment\' : \'value\'}', cb);
  await wait(() => expect(cb).toHaveBeenCalled());

  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith({ status: 200 });
});

// putSurveyUnitViewed
it('Test putSurveyUnitViewed', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn(() => (Promise.resolve({ status: 200 })));
  service.putSurveyUnitViewed(['su'], cb);
  await wait(() => expect(cb).toHaveBeenCalled());

  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith({ status: 200 });
});
// ------------------------ //
// Survey-Units service end //
// ------------------------ //

// ------------------------- //
// Preferences service begin //
// ------------------------- //
// putPreferences
it('Test putPreferences', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn(() => (Promise.resolve({ status: 200 })));
  service.putPreferences(['id'], cb);
  await wait(() => expect(cb).toHaveBeenCalled());

  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith({ status: 200 });
});
// ----------------------- //
// Preferences service end //
// ----------------------- //

// ------------------- //
// Users service begin //
// ------------------- //
// getUser
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
// ----------------- //
// Users service end //
// ----------------- //

// ----------------------- //
// Campaigns service begin //
// ----------------------- //
// getCampaigns
it('Test getCampaigns', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(mainScreenData))),
  );
  service.getCampaigns(cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(mainScreenData);
});

// getCampaignsByInterviewer
it('Test getCampaignsByInterviewer', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(campaignsByInterviewer))),
  );
  service.getCampaignsByInterviewer('idep', cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(campaignsByInterviewer);
  // Same when using the returned promise
  const res = await service.getCampaignsByInterviewer();
  expect(res).toEqual(campaignsByInterviewer);

  global.fetch.mockClear();
  delete global.fetch;
});
// --------------------- //
// Campaigns service end //
// --------------------- //

// -------------------- ----- //
// State counts service begin //
// -------------------------- //
// getStateCount
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

// getStateCountNotAttributed
it('Test getStateCountNotAttributed', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.stateCountNotAttributed))),
  );
  service.getStateCountNotAttributed('id', null, cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.stateCountNotAttributed);
});
// getStateCountByInterviewer
it('Test getStateCountByInterviewer', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.interviewerStateCount))),
  );
  service.getStateCountByInterviewer('id', 'idep', null, cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.interviewerStateCount);
});

// getStateCountByCampaign
it('Test getStateCountByCampaign', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.stateCountByCampaign))),
  );
  service.getStateCountByCampaign(null, cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.stateCountByCampaign);
});

// getStateCountTotalByCampaign
it('Test getStateCountTotalByCampaign', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.stateCountTotal))),
  );
  service.getStateCountTotalByCampaign('id', cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.stateCountTotal);
});
// ----------------------- //
// State count service end //
// ----------------------- //

// ------------------------------ //
// Contact outcomes service begin //
// ------------------------------ //
// getContactOutcomes
it('Test getContactOutcomes', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.contactOutcomes))),
  );
  service.getContactOutcomes('id', null, cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.contactOutcomes);
});

// getContactOutcomesNotAttributed
it('Test getContactOutcomesNotAttributed', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.contactOutcomesNotAttributed))),
  );
  service.getContactOutcomesNotAttributed('id', null, cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.contactOutcomesNotAttributed);
});

// getContactOutcomesByInterviewer
it('Test getContactOutcomesByInterviewer', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.contactOutcomesByInterviewer))),
  );
  service.getContactOutcomesByInterviewer('id', 'idep', null, cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.contactOutcomesByInterviewer);
});

// getContactOutcomesByCampaign
it('Test getContactOutcomesByCampaign', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.contactOutcomesByCampaign))),
  );
  service.getContactOutcomesByCampaign('id', cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.contactOutcomesByCampaign);
});

// ---------------------------- //
// Contact outcomes service end //
// ---------------------------- //

// -------------------------- //
// Interviewers service begin //
// -------------------------- //
// getInterviewers
it('Test getInterviewers', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.interviewers))),
  );
  service.getInterviewers(cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.interviewers);
});

// getInterviewersByCampaign
it('Test getInterviewersByCampaign', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.interviewersByCampaign))),
  );
  service.getInterviewersByCampaign('id', cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.interviewersByCampaign);
});
// ------------------------ //
// Interviewers service end //
// ------------------------ //

// ---------------------------- //
// Questionnaires service begin //
// ---------------------------- //
// getQuestionnaireId
it('Test getQuestionnaireId', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn().mockImplementation(
    () => (Promise.resolve(makeResponse(pearlJamMocks.interviewersByCampaign))),
  );
  service.getQuestionnaireId('id', cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  global.fetch.mockClear();
  delete global.fetch;
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(pearlJamMocks.interviewersByCampaign);
});
// -------------------------- //
// Questionnaires service end //
// -------------------------- //

// --------------------------- //
// Notifications service begin //
// --------------------------- //
// postMessage
it('Test postMessage', async () => {
  const cb = jest.fn();
  global.fetch = jest.fn(() => (Promise.resolve({ status: 200 })));
  service.postMessage('message', cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith({ status: 200 });
});

// verifyName
it('Test verifyName', async () => {
  const mockResp = [{ id: 200, type: 'label', label: 'label' }];
  const cb = jest.fn();
  global.fetch = jest.fn(() => (Promise.resolve(makeResponse(mockResp))));
  service.verifyName('message', cb);
  await wait(() => expect(cb).toHaveBeenCalled());
  // Should return the data fetched
  expect(cb).toHaveBeenLastCalledWith(mockResp);
});
// ------------------------- //
// Notifications service end //
// ------------------------- //
