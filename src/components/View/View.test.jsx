// Link.react.test.js
import React from 'react';
import {
  render, screen, cleanup, waitForElement, wait,
} from '@testing-library/react';
import { NotificationManager } from 'react-notifications';
import DataFormatter from '../../utils/DataFormatter';
import View from './View';
import mocks from '../../tests/mocks';
import C from '../../utils/constants.json';
import D from '../../i18n';

const toLocaleDateString = Date.prototype.toLocaleString;
Date.prototype.toLocaleDateString = function() {
  return toLocaleDateString.call(this, 'en-EN', { timeZone: 'UTC',year: "numeric", month: "numeric", day: "numeric" });
};

const getHours = Date.prototype.getUTCHours;
const getMinutes = Date.prototype.getUTCMinutes;

Date.prototype.getHours = function () {
  return getHours.call(this);
};
Date.prototype.getMinutes = function () {
  return getMinutes.call(this);
};
const OriginalDate = global.Date;

jest
  .spyOn(global, 'Date')
  .mockImplementation((a) => (a ? new OriginalDate(a) : new OriginalDate('2020-08-20T11:01:58.135Z')));
Date.now = jest.fn(() => 1597914060000);

afterEach(cleanup);

jest.mock('react-notifications');
jest.mock('../../utils/DataFormatter');

const {
  mainScreenData,
  userData,
  preferences,
  respModeByInterviewers1Survey,
  respModeBySite,
  respModeBySurvey,
  respModeByInterviewer,
  reviewDataAllSurveys,
  campaignPortalData,
  suTerminated,
  listSU,
} = mocks;

const mockSuccess = jest.fn();
const mockError = jest.fn();
NotificationManager.success = mockSuccess;
NotificationManager.error = mockError;

const updatePreferences = jest.fn((newPrefs, cb) => {
  if (newPrefs.includes('simpsonkgs2020x00')) {
    cb({ status: 200 });
  } else {
    cb({ status: 500 });
  }
});

DataFormatter.mockImplementation(() => ({
  getPreferences: (c) => (c(preferences)),
  getQuestionnaireId: (id, c) => (c({ questionnaireId: 'QXT55' })),
  getDataForMainScreen: (a, c) => {
    if (c) { c(mainScreenData); }
    return Promise.resolve(mainScreenData);
  },
  getListSuTerminated: (id, cb) => (cb(suTerminated)),
  getDataForReview: (s, cb) => (cb(reviewDataAllSurveys)),
  getDataForCampaignPortal: (a, c) => (c(campaignPortalData)),
  getDataForListSU: (a, c) => (c(listSU)),
  getDataForMonitoringTable: (survey, date, pagination, mode, cb) => {
    switch (mode) {
      case C.BY_INTERVIEWER_ONE_SURVEY:
        cb(respModeByInterviewers1Survey);
        break;
      case C.BY_SITE:
        cb(respModeBySite);
        break;
      case C.BY_SURVEY:
        cb(respModeBySurvey);
        break;
      case C.BY_INTERVIEWER:
        cb(respModeByInterviewer);
        break;
      default:
        break;
    }
  },
  updatePreferences,
}));

it('Component is correctly displayed', async () => {
  const component = render(
    <View
      token={null}
      userData={userData}
    />,
  );

  // Should match snapshot
  expect(component).toMatchSnapshot();
});

it('Go to portal', async () => {
  const component = render(
    <View
      token={null}
      userData={userData}
    />,
  );

  screen.getAllByText('1/1/2020')[0].click();
  // Should match snapshot (portal)
  expect(component).toMatchSnapshot();
});

it('Go to review', async () => {
  const component = render(
    <View
      token={null}
      userData={userData}
    />,
  );

  screen.getByTestId('review').click();
  // Should match snapshot (review)
  expect(component).toMatchSnapshot();
});

it('Go to follow-up', async () => {
  const component = render(
    <View
      token={null}
      userData={userData}
    />,
  );

  screen.getByTestId('follow-up').click();
  // Should match snapshot (follow up)
  expect(component).toMatchSnapshot();
});

it('Go to follow by survey', async () => {
  const component = render(
    <View
      token={null}
      userData={userData}
    />,
  );

  component.baseElement.querySelector('#FollowButton').click();
  screen.getByTestId('follow-by-survey').click();
  await waitForElement(() => screen.getByTestId('return-button'));
  // Should match snapshot (follow)
  expect(component).toMatchSnapshot();
});

it('Go to finalized', async () => {
  const component = render(
    <View
      token={null}
      userData={userData}
    />,
  );

  const firstLineCells = component.baseElement.querySelector('tbody').querySelectorAll('tr')[0].querySelectorAll('td');
  firstLineCells[firstLineCells.length - 1].firstChild.click();
  await waitForElement(() => screen.getByTestId('return-button'));
  // Should match snapshot (terminated)
  expect(component).toMatchSnapshot();
});

it('Go to listSU', async () => {
  const component = render(
    <View
      token={null}
      userData={userData}
    />,
  );

  component.baseElement.querySelector('tbody').querySelectorAll('tr')[0].querySelectorAll('td')[8].firstChild.click();
  // Should match snapshot (listSU)
  expect(component).toMatchSnapshot();
});

it('Change preferences', async () => {
  const component = render(
    <View
      token={null}
      userData={userData}
    />,
  );

  screen.getByTestId('preferences').click();

  await waitForElement(() => screen.getByTestId('close-preferences-button'));

  const boxes = component.baseElement.querySelectorAll('input[type="checkbox"]');

  boxes[1].click();
  boxes[2].click();

  const newPrefs = [
    'vqs2021x00',
    'simpsonkgs2020x00',
  ];

  screen.getByTestId('validate-pref-modif').click();

  // updatePreferences should have been called with the new pref surveys in argument
  expect(updatePreferences).toHaveBeenLastCalledWith(newPrefs, expect.anything());

  // Notification.success should have been called
  expect(mockSuccess).toHaveBeenLastCalledWith(D.preferencesUpdated, D.updateSuccess, 3500);
});

it('Change preferences (error response)', async () => {
  const component = render(
    <View
      token={null}
      userData={userData}
    />,
  );

  screen.getByTestId('preferences').click();

  const boxes = component.baseElement.querySelectorAll('input[type="checkbox"]');

  boxes[7].click();

  screen.getByTestId('validate-pref-modif').click();

  // Notification.error should have been called
  expect(mockError).toHaveBeenLastCalledWith(D.preferencesNotUpdated, D.error, 3500);
});

it('Open and close preference modal', async () => {
  const component = render(
    <View
      token={null}
      userData={userData}
    />,
  );

  screen.getByTestId('preferences').click();

  // Modal dialog should show
  expect(component.baseElement.querySelector('.modal-dialog')).toBeTruthy();

  component.baseElement.querySelector('button.close').click();

  // Modal dialog should close
  await wait(() => expect(component.baseElement.querySelector('.modal-dialog')).not.toBeTruthy());
});
