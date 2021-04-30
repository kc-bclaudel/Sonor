// Link.react.test.js
import React from 'react';
import {
  render, screen, cleanup, fireEvent, waitForElement,
} from '@testing-library/react';
import {
  Router, Route, Switch,
} from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Header from './Header';
import mocks from '../../tests/mocks';

import DataFormatter from '../../utils/DataFormatter';
import C from '../../utils/constants.json';

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
  interviewers,
} = mocks;

const history = createMemoryHistory();

const toLocaleDateString = Date.prototype.toLocaleString;
Date.prototype.toLocaleDateString = function() {
  return toLocaleDateString.call(this, 'en-EN', { timeZone: 'UTC',year: "numeric", month: "numeric", day: "numeric" });
};
const OriginalDate = global.Date;
jest
  .spyOn(global, 'Date')
  .mockImplementation((a) => (a ? new OriginalDate(a) : new OriginalDate('2020-08-20T11:01:58.135Z')));
Date.now = jest.fn(() => 1597916474000);

jest.mock('../../utils/DataFormatter');
DataFormatter.mockImplementation(() => ({
  getPreferences: (c) => (c(preferences)),
  getInterviewers: (c) => (c(interviewers)),
  getQuestionnaireId: (id, c) => (c({ questionnaireId: 'QXT55' })),
  getDataForMainScreen: (a, c) => {
    if (c) { c(mainScreenData); }
    return Promise.resolve(mainScreenData);
  },
  getListSuTerminated: (id, cb) => (cb(suTerminated)),
  getDataForReview: (s, cb) => (cb(reviewDataAllSurveys)),
  getDataForCampaignPortal: (a, cb) => (cb(campaignPortalData)),
  getDataForListSU: (a, cb) => (cb(listSU)),
  getUserInfo: (cb) => (cb(userData)),
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
}));

const dataRetreiver = new DataFormatter();

beforeEach(() => {
  history.push('/');
});

afterEach(cleanup);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => jest.requireActual('react-router-dom').useLocation().location || jest.requireActual('react-router-dom').useLocation(),
}));

const TestingRouter = () => (
  <Router history={history}>
    <Header user={userData} showPreferences={() => { mockShowPreferences(); }} dataRetreiver={dataRetreiver} />
    <Switch>
      <Route
        path="*"
        render={(routeProps) => (
          <div>
            <div data-testid="Redirect-url">{JSON.stringify(routeProps.history.location.pathname)}</div>
          </div>
        )}
      />
    </Switch>
  </Router>
);

const mockShowPreferences = jest.fn();

it('Component is correctly displayed', async () => {
  const component = render(
    <TestingRouter />,
  );
  // Should match snapshot (name is Chloé Dupont, date is displayed etc...)
  expect(component).toMatchSnapshot();
});

it('Go to monitoring table by survey', async () => {
  const component = render(
    <TestingRouter />,
  );
  component.baseElement.querySelector('#FollowButton').click();
  screen.getByTestId('follow-by-survey').click();

  // Should redirect to /follow/campaigns
  const redirectUrl = '/follow/campaigns';
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Go to monitoring table by interviewer', async () => {
  const component = render(
    <TestingRouter />,
  );
  component.baseElement.querySelector('#FollowButton').click();
  screen.getByTestId('follow-by-interviewer').click();

  fireEvent.change(component.getByTestId('Survey_selector'), { target: { value: 'simpsons2020x00' } });

  // Should redirect to /follow/interviewers
  const redirectUrl = '/follow/campaign/simpsons2020x00';
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Go to monitoring table by site', async () => {
  const component = render(
    <TestingRouter />,
  );
  component.baseElement.querySelector('#FollowButton').click();
  screen.getByTestId('progress-by-site').click();

  fireEvent.change(component.getByTestId('Survey_selector'), { target: { value: 'simpsons2020x00' } });

  // Should redirect to /follow/interviewers
  const redirectUrl = '/follow/sites/simpsons2020x00';
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Go to monitoring table by survey one interviewer', async () => {
  const component = render(
    <TestingRouter />,
  );
  component.baseElement.querySelector('#FollowButton').click();
  screen.getByTestId('progress-by-survey-one-interviewer').click();

  await waitForElement(() => screen.getByTestId('Interviewer_selector'));

  fireEvent.change(component.getByTestId('Interviewer_selector'), { target: { value: 'INTW5' } });

  // Should redirect to /follow/interviewers
  const redirectUrl = '/follow/campaigns/interviewer/INTW5';
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Go to collection table by survey', async () => {
  const component = render(
    <TestingRouter />,
  );
  component.baseElement.querySelector('#FollowButton').click();
  screen.getByTestId('collection-by-survey').click();

  // Should redirect to /follow/campaigns
  const redirectUrl = '/collection/campaigns';
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Go to collection table by interviewer', async () => {
  const component = render(
    <TestingRouter />,
  );
  component.baseElement.querySelector('#FollowButton').click();
  screen.getByTestId('collection-by-interviewer').click();

  fireEvent.change(component.getByTestId('Survey_selector'), { target: { value: 'simpsons2020x00' } });

  // Should redirect to /follow/interviewers
  const redirectUrl = '/collection/campaign/simpsons2020x00';
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Go to collection table by site', async () => {
  const component = render(
    <TestingRouter />,
  );
  component.baseElement.querySelector('#FollowButton').click();
  screen.getByTestId('collection-by-site').click();

  fireEvent.change(component.getByTestId('Survey_selector'), { target: { value: 'simpsons2020x00' } });

  // Should redirect to /follow/interviewers
  const redirectUrl = '/collection/sites/simpsons2020x00';
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Go to collection table by survey one interviewer', async () => {
  const component = render(
    <TestingRouter />,
  );
  component.baseElement.querySelector('#FollowButton').click();
  screen.getByTestId('collection-by-survey-one-interviewer').click();

  await waitForElement(() => screen.getByTestId('Interviewer_selector'));


  fireEvent.change(component.getByTestId('Interviewer_selector'), { target: { value: 'INTW5' } });

  // Should redirect to /follow/interviewers
  const redirectUrl = '/collection/campaigns/interviewer/INTW5';
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});


it('Go to follow-up', async () => {
  render(
    <TestingRouter />,
  );
  screen.getByTestId('follow-up').click();

  // Should redirect to /followUp
  const redirectUrl = '/followUp';
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Go to review', async () => {
  render(
    <TestingRouter />,
  );
  screen.getByTestId('review').click();
  screen.getByTestId('review-link').click();

  // Should redirect to /review
  const redirectUrl = '/review';
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Go to campaign portal', async () => {
  const component = render(
    <TestingRouter />,
  );
  screen.getByTestId('useful-infos-button').click();
  screen.getByTestId('campaign-portal-link').click();

  fireEvent.change(component.getByTestId('Survey_selector'), { target: { value: 'simpsons2020x00' } });

  // Should redirect to /portal/simpsons2020x00
  const redirectUrl = '/portal/simpsons2020x00';
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Go to list su', async () => {
  const component = render(
    <TestingRouter />,
  );
  screen.getByTestId('useful-infos-button').click();
  screen.getByTestId('list-su-link').click();

  fireEvent.change(component.getByTestId('Survey_selector'), { target: { value: 'simpsons2020x00' } });

  // Should redirect to /portal/simpsons2020x00
  const redirectUrl = '/listSU/simpsons2020x00';
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Show preferences', async () => {
  render(
    <TestingRouter />,
  );
  screen.getByTestId('preferences').click();

  // showPreferences should be called
  expect(mockShowPreferences).toHaveBeenCalled();
});

it('Click on doc link', async () => {
  const component = render(
    <TestingRouter />,
  );
  window.open = jest.fn();

  component.baseElement.querySelector('.HeaderDocLink').click();

  // window.open should have been called
  expect(window.open).toHaveBeenCalled();

});
