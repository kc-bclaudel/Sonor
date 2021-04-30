// Link.react.test.js
import React from 'react';
import {
  render, screen, fireEvent, cleanup,
} from '@testing-library/react';
import { Router, Route, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import DataFormatter from '../../utils/DataFormatter';
import MainScreen from './MainScreen';
import mocks from '../../tests/mocks';

const history = createMemoryHistory();

const toLocaleDateString = Date.prototype.toLocaleString;
Date.prototype.toLocaleDateString = function() {
  return toLocaleDateString.call(this, 'en-EN', { timeZone: 'UTC', year: "numeric", month: "numeric", day: "numeric" });
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

jest.mock('../../utils/DataFormatter');

const data = mocks.mainScreenData;
const { preferences } = mocks;

const TestingRouter = ({ ComponentWithRedirection }) => (
  <Router history={history}>
    <Switch>
      <Route path="/" render={() => <ComponentWithRedirection />} />
      <Route
        path="*"
        render={(routeProps) => (
          <div>
            <div data-testid="Redirect-url">{JSON.stringify(routeProps.history.location.pathname)}</div>
            <div data-testid="Redirect-survey">{!routeProps.history.location || !routeProps.history.location.survey || JSON.stringify(routeProps.history.location.survey)}</div>
            <div data-testid="Redirect-surveyInfos">{!routeProps.history.location || !routeProps.history.location.survey || JSON.stringify(routeProps.history.location.surveyInfos)}</div>
          </div>
        )}
      />
    </Switch>
  </Router>
);

DataFormatter.mockImplementation(() => ({
  getDataForMainScreen: (a, c) => (c(data)),
}));

const mockDataRetreiver = new DataFormatter();

it('Component is correctly displayed', async () => {
  const component = render(
    <Router history={history}>
      <MainScreen preferences={preferences} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  // Should match snapshot (rows with preference = true displayed)
  expect(component).toMatchSnapshot();
});

it('Sort by collection end date', async () => {
  const component = render(
    <Router history={history}>
      <MainScreen preferences={preferences} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  screen.getByTestId('Header-collection-end-date').click();

  // Should match snapshot (rows sorted by date)
  expect(component).toMatchSnapshot();
});

it('Change page', async () => {
  const component = render(
    <Router history={history}>
      <MainScreen preferences={preferences} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  screen.getByTestId('pagination-nav').lastChild.firstChild.click();

  // Should match snapshot (rows displayed have changed)
  expect(component).toMatchSnapshot();
});

it('Change pagination size', async () => {
  const component = render(
    <Router history={history}>
      <MainScreen preferences={preferences} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  fireEvent.change(component.getByTestId('pagination-size-selector'), { target: { value: '10' } });

  // Should match snapshot (all rows are now displayed)
  expect(component).toMatchSnapshot();
});

it('Go to monitoring table by site', async () => {

  const redirectUrl = '/follow/sites/vqs2021x00';
  render(
    <TestingRouter
      ComponentWithRedirection={
        () => <MainScreen preferences={preferences} dataRetreiver={mockDataRetreiver} />
      }
    />,
  );
  screen.getByText('Everyday life and health survey 2021').click();

  // Should redirect to '/follow/sites/vqs2021x00
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);

  // Location should contain survey object
  expect(screen.getByTestId('Redirect-survey').innerHTML).not.toEqual('');
  expect(screen.getByTestId('Redirect-survey')).toMatchSnapshot();
});

it('Go to portal', async () => {
  const redirectUrl = '/portal/vqs202fgd1x00';
  render(
    <TestingRouter
      ComponentWithRedirection={
        () => <MainScreen preferences={preferences} dataRetreiver={mockDataRetreiver} />
      }
    />,
  );
  screen.getAllByText('1/1/2020')[0].click();

  // Should redirect to /portal/vqs202fgd1x00
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);

  // Location should contain survey object
  expect(screen.getByTestId('Redirect-survey').innerHTML).not.toEqual('');
  expect(screen.getByTestId('Redirect-survey')).toMatchSnapshot();

  // Location should contain surveyInfi object
  expect(screen.getByTestId('Redirect-surveyInfos').innerHTML).not.toEqual('');
  expect(screen.getByTestId('Redirect-surveyInfos')).toMatchSnapshot();
});

it('Go to listSU', async () => {
  const redirectUrl = '/listSU/vqs202fgd1x00';
  render(
    <TestingRouter
      ComponentWithRedirection={
        () => <MainScreen preferences={preferences} dataRetreiver={mockDataRetreiver} />
      }
    />,
  );
  screen.getAllByText('4')[0].click();

  // Should redirect to /listSU/vqs202fgd1x00
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);

  // Location should contain survey object and mainscreen info
  expect(screen.getByTestId('Redirect-survey').innerHTML).not.toEqual('');
  expect(screen.getByTestId('Redirect-survey')).toMatchSnapshot();
});

it('Go to monitoring table', async () => {
  const redirectUrl = '/follow/campaign/vqs202fgd1x00';
  render(
    <TestingRouter
      ComponentWithRedirection={
        () => <MainScreen preferences={preferences} dataRetreiver={mockDataRetreiver} />
      }
    />,
  );
  screen.getAllByText('0')[0].click();

  // Should redirect to /follow/campaign/vqs202fgd1x00
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);

  // Location should contain survey object
  expect(screen.getByTestId('Redirect-survey').innerHTML).not.toEqual('');
  expect(screen.getByTestId('Redirect-survey')).toMatchSnapshot();
});
