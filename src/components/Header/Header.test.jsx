// Link.react.test.js
import React from 'react';
import {
  render, screen, cleanup,
} from '@testing-library/react';
import {
  Router, Route, Switch,
} from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Header from './Header';
import mocks from '../../tests/mock_responses';

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



beforeEach(() => {
  history.push('/');
});

afterEach(cleanup);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => jest.requireActual('react-router-dom').useLocation().location || jest.requireActual('react-router-dom').useLocation(),
}));

const { userData } = mocks;

const TestingRouter = () => (
  <Router history={history}>
    <Header user={userData} showPreferences={() => { mockShowPreferences(); }} />
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

  // Should redirect to /follow/interviewers
  const redirectUrl = '/follow/interviewers';
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

  // Should redirect to /review
  const redirectUrl = '/review';
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
