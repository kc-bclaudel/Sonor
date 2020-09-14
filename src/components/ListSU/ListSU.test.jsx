// Link.react.test.js
import React from 'react';
import {
  render, screen, fireEvent, cleanup,
} from '@testing-library/react';
import { Router, Route, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import DataFormatter from '../../utils/DataFormatter';
import ListSU from './ListSU';
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
  history.push('/listSU/vqs2021x00');
});

afterEach(cleanup);

jest.mock('../../utils/DataFormatter');

const survey = mocks.surveyVqs;
const resp = mocks.listSU;

const TestingRouter = ({ ComponentWithRedirection }) => (
  <Router history={history}>
    <Switch>
      <Route path="/listSU/vqs2021x00" render={() => <ComponentWithRedirection />} />
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
  getDataForListSU: (a, c) => (c(resp)),
}));

const mockDataRetreiver = new DataFormatter();

it('Component is correctly displayed', async () => {
  const component = render(
    <Router history={history}>
      <ListSU location={{ survey }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );
  // Should match snapshot (rows displayed)
  expect(component).toMatchSnapshot();
});

it('Sort by interviewer name', async () => {
  const component = render(
    <Router history={history}>
      <ListSU location={{ survey }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

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

  fireEvent.change(component.getByTestId('pagination-size-selector'), { target: { value: '10' } });

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

  fireEvent.change(component.getByTestId('Survey_selector'), { target: { value: 'simpsons2020x00' } });

  // Should redirect to '/listSU/simpsons2020x00'
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);

  // Location should contain survey object
  expect(screen.getByTestId('Redirect-survey').innerHTML).not.toEqual('');
  expect(screen.getByTestId('Redirect-survey')).toMatchSnapshot();
});

it('Reloading the page with no survey set (F5)', async () => {

  const redirectUrl = '/';
  render(
    <TestingRouter
      ComponentWithRedirection={() => <ListSU location={{ }} dataRetreiver={mockDataRetreiver} />}
    />,
  );

  // Should redirect to '/'
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Export table', async () => {
  const component = render(
    <Router history={history}>
      <ListSU location={{ survey }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  const realRemoveFunc = HTMLAnchorElement.prototype.remove;
  const removeElmMock = jest.fn();
  HTMLAnchorElement.prototype.remove = removeElmMock;

  const fileTitle = 'National_organizational_unit_Everyday_life_and_health_survey_2021_UE_confiees_8202020.csv';
  const fileContent = 'data:text/csv;charset=utf-8,Identifier;Ssech;Department;Town;Interviewer;Idep%0A20;1;59620;Aulnoye-Aimeries;Lucas%20Margie;INTW1%0A21;1;38200;Vienne;Campbell%20Carlton;INTW2%0A22;2;62000;Arras;Xern%20Fabrice;INTW4%0A29;1;65000;Belfort;Delmare%20Mathilde;INTW12%0A33;1;75000;Paris;Antoine%20Tarje;INTW14%0A55;2;62000;Arras;Bertrand%20Ulysse;INTW4%0A23;1;35000;Rennes;Grant%20Melody;INTW4';
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