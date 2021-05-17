// Link.react.test.js
import React from 'react';
import {
  render, screen, fireEvent, cleanup,
} from '@testing-library/react';
import { Router, Route, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import DataFormatter from '../../utils/DataFormatter';
import Terminated from './Terminated';
import mocks from '../../tests/mocks';

const history = createMemoryHistory();

const toLocaleDateString = Date.prototype.toLocaleString;
const getHours = Date.prototype.getUTCHours;
const getMinutes = Date.prototype.getUTCMinutes;
Date.prototype.toLocaleDateString = function() {
  return toLocaleDateString.call(this, 'en-EN', { timeZone: 'UTC',year: "numeric", month: "numeric", day: "numeric" });
};
Date.prototype.getHours = function() {
  return getHours.call(this);
};
Date.prototype.getMinutes = function() {
  return getMinutes.call(this);
};
const OriginalDate = global.Date;
jest
  .spyOn(global, 'Date')
  .mockImplementation((a) => (a ? new OriginalDate(a) : new OriginalDate('2020-08-20T11:01:58.135Z')));
Date.now = jest.fn(() => 1597916474000);

beforeEach(() => {
  history.push('/terminated/vqs2021x00');
});

afterEach(cleanup);

jest.mock('../../utils/DataFormatter');
const survey = mocks.surveyVqs;
const resp = mocks.suTerminated;
const { stateHistory } = mocks;

const TestingRouter = ({ ComponentWithRedirection }) => (
  <Router history={history}>
    <Switch>
      <Route path="/terminated/:id" render={(routeProps) => <ComponentWithRedirection {...routeProps} />} />
      <Route
        path="*"
        render={(routeProps) => (
          <div>
            <div data-testid="Redirect-url">{JSON.stringify(routeProps.history.location.pathname)}</div>
            <div data-testid="Redirect-survey">
              {!routeProps.history.location
              || !routeProps.history.location.survey
              || JSON.stringify(routeProps.history.location.survey)}
            </div>
          </div>
        )}
      />
    </Switch>
  </Router>
);

DataFormatter.mockImplementation(() => ({
  getListSuTerminated: (id, cb) => (cb(resp)),
  getStatesSurvey: (id, cb) => (cb(stateHistory)),
}));

const mockDataRetreiver = new DataFormatter();

it('Component is correctly displayed', async () => {
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Terminated
            location={{ survey }}
            match={props.match}
            dataRetreiver={mockDataRetreiver}
          />
        )
      }
    />,
  );

  // Should match snapshot (rows displayed)
  expect(component).toMatchSnapshot();
});

it('Sort by su id', async () => {
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Terminated
            location={{ survey }}
            match={props.match}
            dataRetreiver={mockDataRetreiver}
          />
        )
      }
    />,
  );

  screen.getByTestId('TableHeader_id_terminated').click();
  // Should match snapshot (rows sorted by id)
  expect(component).toMatchSnapshot();
});

it('Change page', async () => {
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Terminated
            location={{ survey }}
            match={props.match}
            dataRetreiver={mockDataRetreiver}
          />
        )
      }
    />,
  );

  screen.getByTestId('pagination-nav').lastChild.firstChild.click();

  // Should match snapshot (rows displayed have changed)
  expect(component).toMatchSnapshot();
});

it('Change pagination size', async () => {
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Terminated
            location={{ survey }}
            match={props.match}
            dataRetreiver={mockDataRetreiver}
          />
        )
      }
    />,
  );

  fireEvent.change(component.getByTestId('pagination-size-selector'), { target: { value: '10' } });

  // Should match snapshot (all rows are now displayed)
  expect(component).toMatchSnapshot();
});

it('Select another survey', async () => {
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Terminated
            location={{ survey }}
            match={props.match}
            dataRetreiver={mockDataRetreiver}
          />
        )
      }
    />,
  );

  const redirectUrl = '/terminated/simpsons2020x00';

  fireEvent.change(component.getByTestId('Survey_selector'), { target: { value: 'simpsons2020x00' } });

  // Should redirect to '/terminated/simpsons2020x00'
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);

  // Location should contain survey object
  expect(screen.getByTestId('Redirect-survey').innerHTML).not.toEqual('');
  expect(screen.getByTestId('Redirect-survey')).toMatchSnapshot();
});

it('Reloading the page with no survey set (F5)', async () => {
  const redirectUrl = '/';
  render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Terminated
            location={{ }}
            match={props.match}
            dataRetreiver={mockDataRetreiver}
          />
        )
      }
    />,
  );

  // Should redirect to '/'
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Display and hide history', async () => {
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Terminated
            location={{ survey }}
            match={props.match}
            dataRetreiver={mockDataRetreiver}
          />
        )
      }
    />,
  );

  component.baseElement.querySelector('tbody').querySelectorAll('tr')[0].querySelector('.HistoryDisplayIcon').click();

  // State history table should be displayed
  expect(component.baseElement.querySelector('#StateHistoryTableContainer')).toBeTruthy();

  // Component should match snapshot
  expect(component).toMatchSnapshot();

  screen.getByTestId('close-history').click();

  // State history should not be displayed anymore
  expect(component.baseElement.querySelector('#StateHistoryTableContainer')).not.toBeTruthy();
});

it('Click on edit', async () => {
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Terminated
            location={{ survey }}
            match={props.match}
            dataRetreiver={mockDataRetreiver}
          />
        )
      }
    />,
  );
  window.open = jest.fn();

  component.baseElement.querySelector('tbody').querySelectorAll('tr')[0].querySelector('.EditLink').click();

  // window.open should have been called
  expect(window.open).toHaveBeenCalled();
});
