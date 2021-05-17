// Link.react.test.js
import React from 'react';
import {
  render, screen, fireEvent, cleanup, wait,
} from '@testing-library/react';
import { Router, Route, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { NotificationManager } from 'react-notifications';
import DataFormatter from '../../utils/DataFormatter';
import Review from './Review';
import mocks from '../../tests/mocks';
import D from '../../i18n';

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

afterEach(cleanup);

jest.mock('../../utils/DataFormatter');
jest.mock('react-notifications');

const survey = mocks.surveyVqs;

const { surveySimpsons } = mocks;

const respAllSurvey = mocks.reviewDataAllSurveys;
const respOneSurvey = mocks.reviewDataOneSurvey;

const mockFinalizeSurveyUnits = jest.fn((listSU) => Promise.resolve(
  listSU.map((su) => (su === '4818' ? { status: 500 } : { status: 200 })),
));
const mockGetDataForReview = jest.fn((s, cb) => {
  if (s) {
    cb(respOneSurvey);
  } else {
    cb(respAllSurvey);
  }
});

const mockDataFormatter = DataFormatter.mockImplementation(() => ({
  getDataForReview: mockGetDataForReview,
  finalizeSurveyUnits: mockFinalizeSurveyUnits,
  updateSurveyUnitViewed: jest.fn(() => ({ status: 200 })),
}));

const mockSuccess = jest.fn();
const mockError = jest.fn();
NotificationManager.success = mockSuccess;
NotificationManager.error = mockError;

const TestingRouter = ({ ComponentWithRedirection }) => (
  <Router history={history}>
    <Switch>
      <Route path="/review/:id?" render={(routeProps) => <ComponentWithRedirection {...routeProps} />} />
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

const mockDataRetreiver = new DataFormatter();

it('Component is correctly displayed (for one survey)', async () => {
  history.push('/review/vqs2021x00');
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Review
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

it('Component is correctly displayed (for all surveys)', async () => {
  history.push('/review');
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Review
            location={{}}
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

it('Sort by interviewer name', async () => {
  history.push('/review/vqs2021x00');
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Review
            location={{ survey }}
            match={props.match}
            dataRetreiver={mockDataRetreiver}
          />
        )
      }
    />,
  );

  screen.getByTestId('TableHeader_interviewer_name_review').click();

  // Should match snapshot (rows sorted by name)
  expect(component).toMatchSnapshot();
});

it('Change page', async () => {
  history.push('/review');
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Review
            location={{}}
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
  history.push('/review');
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Review
            location={{}}
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
  history.push('/review/vqs2021x00');
  const redirectUrl = '/review/simpsons2020x00';
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Review
            location={{survey} }
            match={props.match}
            dataRetreiver={mockDataRetreiver}
          />
        )
      }
    />,
  );

  fireEvent.change(component.getByTestId('Survey_selector'), { target: { value: 'simpsons2020x00' } });

  // Should redirect to '/review/simpsons2020x00'
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);

  // Location should contain survey object
  expect(screen.getByTestId('Redirect-survey').innerHTML).not.toEqual('');
  expect(screen.getByTestId('Redirect-survey')).toMatchSnapshot();
});

it('Reloading the page with no survey set (F5) (for one survey)', async () => {
  history.push('/review/vqs2021x00');
  const redirectUrl = '/';
  render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Review
            location={{}}
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

it('Select 2 survey units and validate', async () => {
  history.push('/review');
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Review
            location={{ }}
            match={props.match}
            dataRetreiver={mockDataRetreiver}
          />
        )
      }
    />,
  );

  const firstCheckbox = component.baseElement.querySelector('input[value="1032"]');
  const secondCheckbox = component.baseElement.querySelector('input[value="4819"]');

  firstCheckbox.click();
  secondCheckbox.click();

  // Checkboxes should be checked
  expect(firstCheckbox).toHaveProperty('checked', true);
  expect(secondCheckbox).toHaveProperty('checked', true);

  screen.getByTestId('validate-su').click();

  // Modal dialog should show
  expect(component.baseElement.querySelector('.modal-dialog')).toBeTruthy();

  screen.getByTestId('confirm-validate').click();

  // Validate survey units should be called with correct arguments
  expect(mockFinalizeSurveyUnits).toHaveBeenLastCalledWith(['1032', '4819']);

  // Notification manager should have been called to display success
  await wait(() => expect(mockSuccess).toHaveBeenLastCalledWith(
    `${D.reviewAlertSuccess}: 1032, 4819.`,
    D.updateSuccess,
    3500,
  ));
});

it('Select a survey unit and validate (error response)', async () => {
  history.push('/review');
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Review
            location={{ }}
            match={props.match}
            dataRetreiver={mockDataRetreiver}
          />
        )
      }
    />,
  );

  const firstCheckbox = component.baseElement.querySelector('input[value="4818"]');

  firstCheckbox.click();

  // Checkbox should be checked
  expect(firstCheckbox).toHaveProperty('checked', true);

  screen.getByTestId('validate-su').click();

  // Modal dialog should show
  expect(component.baseElement.querySelector('.modal-dialog')).toBeTruthy();

  screen.getByTestId('confirm-validate').click();

  // Validate survey units should be called with correct arguments
  expect(mockFinalizeSurveyUnits).toHaveBeenLastCalledWith(['4818']);

  // Notification manager should have been called to display error
  await wait(() => expect(mockError).toHaveBeenLastCalledWith(
    `${D.reviewAlertError}: 4818.`,
    D.error,
    3500,
  ));
});

it('Check and uncheck all SUs', async () => {
  history.push('/review');
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Review
            location={{ }}
            match={props.match}
            dataRetreiver={mockDataRetreiver}
          />
        )
      }
    />,
  );

  const checkAllBox = component.baseElement.querySelector('input[name="checkAll"]');

  checkAllBox.click();

  // Checkboxes should all be checked
  component.baseElement.querySelectorAll('input[type="checkbox"]').forEach((box) => {
    expect(box).toHaveProperty('checked', true);
  });

  checkAllBox.click();

  // Checkboxes should all be unchecked
  component.baseElement.querySelectorAll('input[type="checkbox"]').forEach((box) => {
    expect(box).not.toHaveProperty('checked', true);
  });
});

it('Close modal with cross', async () => {
  history.push('/review');
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Review
            location={{ }}
            match={props.match}
            dataRetreiver={mockDataRetreiver}
          />
        )
      }
    />,
  );

  const firstCheckbox = component.baseElement.querySelector('input[value="4818"]');
  firstCheckbox.click();
  screen.getByTestId('validate-su').click();

  // Modal dialog should show
  expect(component.baseElement.querySelector('.modal-dialog')).toBeTruthy();
  component.baseElement.querySelector('button.close').click();

  // Modal dialog should close
  await wait(() => expect(component.baseElement.querySelector('.modal-dialog')).not.toBeTruthy());
});

it('Close modal with button', async () => {
  history.push('/review');
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Review
            location={{ }}
            match={props.match}
            dataRetreiver={mockDataRetreiver}
          />
        )
      }
    />,
  );

  const firstCheckbox = component.baseElement.querySelector('input[value="4818"]');
  firstCheckbox.click();
  screen.getByTestId('validate-su').click();

  // Modal dialog should show
  expect(component.baseElement.querySelector('.modal-dialog')).toBeTruthy();
  screen.getByTestId('close-modal').click();

  // Modal dialog should close
  await wait(() => expect(component.baseElement.querySelector('.modal-dialog')).not.toBeTruthy());
});

it('Click on the 3 cells of a SU line', async () => {
  history.push('/review');
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        (props) => (
          <Review
            location={{ }}
            match={props.match}
            dataRetreiver={mockDataRetreiver}
          />
        )
      }
    />,
  );

  window.open = jest.fn();

  const questionnaireButton = component.baseElement.querySelectorAll('tbody')[0].querySelectorAll('.fa-calendar')[0];
  questionnaireButton.click();

  // window.open should have been called 3 times
  expect(window.open).toHaveBeenCalledTimes(1);
});