// Link.react.test.js
import React from 'react';
import { act } from 'react-dom/test-utils';
import {
  render, screen, fireEvent, cleanup, waitForElement, wait,
} from '@testing-library/react';
import { Router, Route, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import DataFormatter from '../../utils/DataFormatter';
import Close from './Close';
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
  history.push('/close/vqs2021x00');
});

afterEach(cleanup);

jest.mock('../../utils/DataFormatter');

const survey = mocks.surveyVqs;
const resp = mocks.formattedCloseData;

const TestingRouter = ({ ComponentWithRedirection }) => (
  <Router history={history}>
    <Switch>
      <Route path="/close/vqs2021x00" component={() => <ComponentWithRedirection />} />
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
  getDataForClosePage: (c) => (setTimeout(() => { c(resp); }, 3)),
}));

const mockDataRetreiver = new DataFormatter();

it('Component is correctly displayed', async () => {
  const component = render(
    <Router history={history}>
      <Close location={{ survey }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );
  await waitForElement(() => screen.getByTestId('TableHeader_interviewer_name'));
  // Should match snapshot (rows displayed)
  expect(component).toMatchSnapshot();
});

it('Sort by interviewer name', async () => {
  const component = render(
    <Router history={history}>
      <Close location={{ survey }} dataRetreiver={mockDataRetreiver} />
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
      <Close location={{ survey }} dataRetreiver={mockDataRetreiver} />
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
      <Close location={{ survey }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );
  await waitForElement(() => screen.getByTestId('TableHeader_interviewer_name'));
  act(() => {
    fireEvent.change(component.getByTestId('pagination-size-selector'), { target: { value: '10' } });
  });
  // Should match snapshot (all 8 rows are now displayed)
  expect(component).toMatchSnapshot();
});

it('Export table', async () => {
  const component = render(
    <Router history={history}>
      <Close location={{ survey }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );
  await waitForElement(() => screen.getByTestId('TableHeader_interviewer_name'));
  const realRemoveFunc = HTMLAnchorElement.prototype.remove;
  const removeElmMock = jest.fn();
  HTMLAnchorElement.prototype.remove = removeElmMock;

  const fileTitle = 'UE_à_clore_8202020.csv';
  const fileContent = 'data:text/csv;charset=utf-8,%EF%BB%BFSurvey;Identifier;Interviewer;Ssech;Department;Town;Provisional%20state%0ASimpsons;1023;Dupont%20Chlo%C3%A9;hgSkR29;95;MONTMORENCY;ANS%0ASimpsons;4811;Boulanger%20Jacques;dlcB55jdf;90;BELFORT;ANS%0ASimpsons;1024;Dupont%20Chlo%C3%A9;hgSkR29;95;MONTMORENCY;ANS%0AVQS;4812;Boulanger%20Jacques;dlcB55jdf;90;BELFORT;ANS%0AVQS;1025;Dupont%20Chlo%C3%A9;hgSkR29;95;MONTMORENCY;ANS%0AVQS;4813;Boulanger%20Jacques;dlcB55jdf;90;BELFORT;ANS%0AVQS;1027;Dupont%20Chlo%C3%A9;hgSkR29;95;MONTMORENCY;ANS%0AVQS;4815;Fabres%20Thierry;dlcB55jdf;90;BELFORT;ANS%0AVQS;1028;Dupont%20Chlo%C3%A9;hgSkR29;95;MONTMORENCY;ANS%0AVQS;4816;Boulanger%20Jacques;dlcB55jdf;90;BELFORT;ANS%0AVQS;1029;Fabres%20Thierry;hgSkR29;95;MONTMORENCY;ANS%0AVQS;4817;Boulanger%20Jacques;dlcB55jdf;90;BELFORT;ANS%0AVQS;1030;Dupont%20Chlo%C3%A9;hgSkR29;95;MONTMORENCY;ANS%0ALC%202020;4818;Boulanger%20Jacques;dlcB55jdf;90;BELFORT;ANS%0ALC%202020;1032;Dupont%20Chlo%C3%A9;hgSkR29;95;MONTMORENCY;ANS%0ALC%202020;4819;Boulanger%20Jacques;dlcB55jdf;90;BELFORT;ANS';
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