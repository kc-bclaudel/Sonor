// Link.react.test.js
import React from 'react';
import { act } from 'react-dom/test-utils';
import {
  render, screen, fireEvent, cleanup, waitForElement, wait,
} from '@testing-library/react';
import { Router, Route, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import DataFormatter from '../../utils/DataFormatter';
import ListSU from './ListSU';
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
  history.push('/listSU/vqs2021x00');
});

afterEach(cleanup);

jest.mock('../../utils/DataFormatter');

const survey = mocks.surveyVqs;
const resp = mocks.listSU;

const TestingRouter = ({ ComponentWithRedirection }) => (
  <Router history={history}>
    <Switch>
      <Route path="/listSU/vqs2021x00" component={() => <ComponentWithRedirection />} />
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

DataFormatter.mockImplementation(() => ({
  getDataForListSU: (a, c) => (setTimeout(() => { c(resp); }, 3)),
}));

const mockDataRetreiver = new DataFormatter();

it('Component is correctly displayed', async () => {
  const component = render(
    <Router history={history}>
      <ListSU location={{ survey }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );
  await waitForElement(() => screen.getByTestId('TableHeader_interviewer_name'));
  // Should match snapshot (rows displayed)
  expect(component).toMatchSnapshot();
});

it('Sort by interviewer name', async () => {
  const component = render(
    <Router history={history}>
      <ListSU location={{ survey }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );
  await waitForElement(() => screen.getByTestId('TableHeader_interviewer_name'));
  screen.getByTestId('TableHeader_interviewer_name').click();
  // Should match snapshot (rows sorted by name)
  expect(component).toMatchSnapshot();
});

it('Change page', async () => {
  const component = render(
    <Router history={history}>
      <ListSU location={{ survey }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  await waitForElement(() => screen.getByTestId('TableHeader_interviewer_name'));
  screen.getByTestId('pagination-nav').lastChild.firstChild.click();

  // Should match snapshot (rows displayed have changed)
  expect(component).toMatchSnapshot();
});

it('Change pagination size', async () => {
  const component = render(
    <Router history={history}>
      <ListSU location={{ survey }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );
  await waitForElement(() => screen.getByTestId('TableHeader_interviewer_name'));
  act(() => {
    fireEvent.change(component.getByTestId('pagination-size-selector'), { target: { value: '10' } });
  });
  // Should match snapshot (all 8 rows are now displayed)
  expect(component).toMatchSnapshot();
});

it('Select another survey', async () => {
  const redirectUrl = '/listSU/simpsons2020x00';
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        () => <ListSU location={{ survey }} dataRetreiver={mockDataRetreiver} />
      }
    />,
  );
  await waitForElement(() => screen.getByTestId('TableHeader_interviewer_name'));
  act(() => {
    fireEvent.change(component.getByTestId('Survey_selector'), { target: { value: 'simpsons2020x00' } });
  });
  // Should redirect to '/listSU/simpsons2020x00'
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);

  // Location should contain survey object
  expect(screen.getByTestId('Redirect-survey').innerHTML).not.toEqual('');
  expect(screen.getByTestId('Redirect-survey')).toMatchSnapshot();
});

it('Reloading the page with no survey set (F5)', async () => {

  const redirectUrl = '/';
  act(() => {
    render(
      <TestingRouter
        ComponentWithRedirection={() => <ListSU location={{ }} dataRetreiver={mockDataRetreiver} />}
      />,
    );
  });

  // Should redirect to '/'
  await wait(() => expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`));
});

it('Export table', async () => {
  const component = render(
    <Router history={history}>
      <ListSU location={{ survey }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );
  await waitForElement(() => screen.getByTestId('TableHeader_interviewer_name'));
  const realRemoveFunc = HTMLAnchorElement.prototype.remove;
  const removeElmMock = jest.fn();
  HTMLAnchorElement.prototype.remove = removeElmMock;

  const fileTitle = 'National_organizational_unit_Everyday_life_and_health_survey_2021_UE_confiees_8202020.csv';
  const fileContent = 'data:text/csv;charset=utf-8,%EF%BB%BFIdentifier;Interviewer;Idep;Ssech;Department;Town;Provisional%20state%0A20;Lucas%20Margie;INTW1;1;59;Aulnoye-Aimeries;%0A21;Campbell%20Carlton;INTW2;1;38;Vienne;%0A22;Xern%20Fabrice;INTW4;2;62;Arras;%0A29;Delmare%20Mathilde;INTW12;1;65;Belfort;%0A33;Antoine%20Tarje;INTW14;1;75;Paris;%0A55;Bertrand%20Ulysse;INTW4;2;62;Arras;%0A23;Grant%20Melody;INTW4;1;35;Rennes;';
  screen.getByTestId('export-button').click();
  const downnloadLink = component.baseElement.querySelector('a[download]');

  // Check that file title is correct
  expect(downnloadLink.getAttribute('download')).toEqual(fileTitle);

  // Check that file content is correct
  expect(downnloadLink.getAttribute('href')).toEqual(fileContent);

  // Should match snapshot (with link attached)
  expect(component).toMatchSnapshot();

  // Link should have been removed
  expect(removeElmMock).toHaveBeenCalled();

  HTMLAnchorElement.prototype.remove = realRemoveFunc;
  downnloadLink.remove();
});