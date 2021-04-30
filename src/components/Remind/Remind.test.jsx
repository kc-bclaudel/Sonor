// Link.react.test.js
import React from 'react';
import {
  render, screen, fireEvent, cleanup,
} from '@testing-library/react';
import { Router, Route, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import DataFormatter from '../../utils/DataFormatter';
import Remind from './Remind';
import mocks from '../../tests/mocks';

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
  history.push('/remind/vqs2021x00');
});

const survey = mocks.surveyVqs;

afterEach(cleanup);

jest.mock('../../utils/DataFormatter');

const mockDataRetreiver = new DataFormatter();

const TestingRouter = ({ ComponentWithRedirection }) => (
  <Router history={history}>
    <Switch>
      <Route path="/remind/vqs2021x00" render={() => <ComponentWithRedirection />} />
      <Route
        path="*"
        render={(routeProps) => (
          <div>
            <div data-testid="Redirect-url">{JSON.stringify(routeProps.history.location.pathname)}</div>
            <div data-testid="Redirect-survey">{!routeProps.history.location || !routeProps.history.location.survey || JSON.stringify(routeProps.history.location.survey)}</div>
          </div>
        )}
      />
    </Switch>
  </Router>
);

it('Component is correctly displayed', async () => {
  const component = render(
    <Router history={history}>
      <Remind location={{ survey }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  // Should match snapshot
  expect(component).toMatchSnapshot();
});

it('Select another survey', async () => {

  const redirectUrl = '/remind/simpsons2020x00';
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        () => <Remind location={{ survey }} dataRetreiver={mockDataRetreiver} />
      }
    />,
  );

  fireEvent.change(component.getByTestId('Survey_selector'), { target: { value: 'simpsons2020x00' } });

  // Title has changed
  expect(component.baseElement.querySelector('.SurveyTitle').innerHTML).toEqual('Survey on the Simpsons tv show 2020');
});