// Link.react.test.js
import 'core-js';
import React from 'react';
import {
  render, screen, fireEvent, cleanup, waitForElement,
} from '@testing-library/react';
import { Router, Route, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import DataFormatter from '../../utils/DataFormatter';
import MonitoringTable from './MonitoringTable';
import mocks from '../../tests/mocks';
import C from '../../utils/constants.json';

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

const survey = mocks.surveyVqs;
const interviewer = mocks.interviewerINTW5;
const {
  respModeByInterviewers1Survey,
  respModeBySite,
  respModeBySurvey,
  respModeByInterviewer,
  respModeBySurveyOneInterviewer,
  mainScreenData,
} = mocks;

const TestingRouter = ({ ComponentWithRedirection }) => (
  <Router history={history}>
    <Switch>
      <Route exact path="/follow/campaign/vqs2021x00" component={() => <ComponentWithRedirection />} />
      <Route exact path="/follow/sites/vqs2021x00" component={() => <ComponentWithRedirection />} />
      <Route exact path="/follow/campaigns/interviewer/INTW7" component={() => <ComponentWithRedirection />} />
      <Route exact path="/follow/campaigns/interviewer/INTW5" component={() => <ComponentWithRedirection />} />
      <Route exact path="/follow/campaigns" component={() => <ComponentWithRedirection />} />
      <Route
        path="*"
        component={(routeProps) => (
          <div>
            <div data-testid="Redirect-url">{JSON.stringify(routeProps.history.location.pathname)}</div>
            <div data-testid="Redirect-survey">{!routeProps.history.location || !routeProps.history.location.survey || JSON.stringify(routeProps.history.location.survey)}</div>
          </div>
        )}
      />
    </Switch>
  </Router>
);

const mockGetDataForMainScreen = jest.fn(() => (Promise.resolve(mainScreenData)));

const mockGetDataForMonitoringTable = jest.fn(
  (survey, date, pagination, mode, cb) => {
    switch(mode){
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
      case C.BY_SURVEY_ONE_INTERVIEWER: 
        cb(respModeBySurveyOneInterviewer);
        break;
        
    }
  } 
);

const mockDataFormatter = DataFormatter.mockImplementation(() => ({
  getDataForMonitoringTable: mockGetDataForMonitoringTable,
  getDataForMainScreen: mockGetDataForMainScreen,
}));

const mockDataRetreiver = new DataFormatter();

it('Component is correctly displayed', async () => {
  const pathname = '/follow/campaign/vqs2021x00';
  history.push(pathname);
  const component = render(
    <Router history={history}>
      <MonitoringTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  // Should match snapshot (rows displayed)
  expect(component).toMatchSnapshot();
});

it('Sort by interviewer name', async () => {
  const pathname = '/follow/campaign/vqs2021x00';
  history.push(pathname);
  const component = render(
    <Router history={history}>
      <MonitoringTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  screen.getByTestId('TableHeader_label').click();
  // Should match snapshot (rows sorted by name)
  expect(component).toMatchSnapshot();
});

it('Change page', async () => {
  const pathname = '/follow/campaign/vqs2021x00';
  history.push(pathname);
  const component = render(
    <Router history={history}>
      <MonitoringTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  screen.getByTestId('pagination-nav').lastChild.firstChild.click();

  // Should match snapshot (rows displayed have changed)
  expect(component).toMatchSnapshot();
});

it('Change pagination size', async () => {
  const pathname = '/follow/campaign/vqs2021x00';
  history.push(pathname);
  const component = render(
    <Router history={history}>
      <MonitoringTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  fireEvent.change(component.getByTestId('pagination-size-selector'), { target: { value: '10' } });

  // Should match snapshot (all rows are now displayed)
  expect(component).toMatchSnapshot();
});

it('Select another survey (by interviewer)', async () => {

  const pathname = '/follow/campaign/vqs2021x00';
  history.push(pathname);

  const redirectUrl = '/follow/campaign/simpsons2020x00';

  const component = render(
    <TestingRouter
    ComponentWithRedirection={
      () => <MonitoringTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    }
  />,
  );

  fireEvent.change(component.getByTestId('Survey_selector'), { target: { value: 'simpsons2020x00' } });

  // Should redirect to '/follow/campaign/simpsons2020x00'
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);

  // Location should contain survey object
  expect(screen.getByTestId('Redirect-survey').innerHTML).not.toEqual('');
  expect(screen.getByTestId('Redirect-survey')).toMatchSnapshot();
});

it('Select another survey (by site)', async () => {
  const pathname = '/follow/sites/vqs2021x00';
  history.push(pathname);

  const redirectUrl = '/follow/sites/simpsons2020x00';

  const component = render(
    <TestingRouter
    ComponentWithRedirection={
      () => <MonitoringTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    }
  />,
  );

  fireEvent.change(component.getByTestId('Survey_selector'), { target: { value: 'simpsons2020x00' } });

  // Should redirect to '/follow/campaign/simpsons2020x00'
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);

  // Location should contain survey object
  expect(screen.getByTestId('Redirect-survey').innerHTML).not.toEqual('');
  expect(screen.getByTestId('Redirect-survey')).toMatchSnapshot();
});

it('Select another date', async () => {
  const pathname = '/follow/campaign/vqs2021x00';
  history.push(pathname);

  const component = render(
    <Router history={history}>
      <MonitoringTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  fireEvent.change(component.getByTestId('date-picker'), { target: { value: '2020-02-20' } });

  // getDataForMonitoringTable should have been called with the new date
  expect(mockGetDataForMonitoringTable).toHaveBeenLastCalledWith(
    expect.anything(),
    1582156800000,
    expect.anything(),
    expect.anything(),
    expect.anything(),
  );

  // And the page should render correctly
  expect(component).toMatchSnapshot();
});

it('Component did update', () => {
  const pathname = '/follow/campaign/vqs2021x00';
  history.push(pathname);

  const { container } = render(
    <Router history={history}>
      <MonitoringTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  render(
    <Router history={history}>
      <MonitoringTable location={{ survey, pathname: '/follow/sites/simpsons2020x00' }} dataRetreiver={mockDataRetreiver} />
    </Router>,
    { container },
  );

  // getDataForMonitoringTable should have been called again with the mode by site
  expect(mockGetDataForMonitoringTable).toHaveBeenLastCalledWith(
    expect.anything(),
    expect.anything(),
    expect.anything(),
    C.BY_SITE,
    expect.anything(),
  );
})

it('Reloading the page with no survey set (F5) by interviewer 1 survey (Campaign > Progress by interviewer)', async () => {

  const pathname = '/follow/campaign/vqs2021x00';

  const redirectUrl = '/';

  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        () => <MonitoringTable location={{ pathname }} dataRetreiver={mockDataRetreiver} />
      }
    />,
  );

  // Should redirect to '/'
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Reloading the page with no survey set (F5) by site (Campaign > Progress by site)', async () => {

  const pathname = '/follow/sites/vqs2021x00';
  history.push(pathname);

  const redirectUrl = '/';

  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        () => <MonitoringTable location={{ pathname }} dataRetreiver={mockDataRetreiver} />
      }
    />,
  );

  // Should redirect to '/'
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Reloading the page with no survey set (F5) by survey for an interviewer (Interviewer > Progress by campaign)', async () => {
  const pathname = '/follow/campaigns/interviewer/INTW7';
  history.push(pathname);

  const redirectUrl = '/';

  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        () => <MonitoringTable location={{ pathname }} dataRetreiver={mockDataRetreiver} />
      }
    />,
  );

  // Should redirect to '/'
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Reloading the page with no survey set (F5) by survey (Site > Progress)', async () => {
  const pathname = '/follow/campaigns';
  history.push(pathname);

  const component = render(
    <Router history={history}>
      <MonitoringTable location={{ pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  await waitForElement(() => screen.getByTestId('pagination-nav'));

  // Should call getDataForMainScreen and display the page anyway
  expect(mockGetDataForMainScreen).toHaveBeenCalled();
  expect(component).toMatchSnapshot();
});

it('Export table by interviewer one survey', async () => {
  const pathname = '/follow/campaign/vqs2021x00';
  history.push(pathname);

  const component = render(
    <Router history={history}>
      <MonitoringTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  const realRemoveFunc = HTMLAnchorElement.prototype.remove;
  const removeElmMock = jest.fn();
  HTMLAnchorElement.prototype.remove = removeElmMock;

  const fileTitle = 'National_organizational_unit_Everyday_life_and_health_survey_2021_Avancement_enqueteurs_8202020.csv';
  const fileContent = 'data:text/csv;charset=utf-8,%EF%BB%BFLast%20name;First%20name;Idep;;Completion%20rate;;Allocated;Not%20started;In%20progress%20by%20interviewer;Waiting%20for%20interviewer%20review;To%20review;Reviewed%20ended;;Preparing%20contact;At%20least%20one%20contact;Appointment%20taken;Interview%20started%0ABoulanger;Emilie;INTW9;;2.9%25;;104;3;34;0;2;1;;29;;;5%0ABoulanger;Jacques;INTW6;;2.9%25;;104;3;34;0;2;1;;29;;;5%0ADelmarre;Alphonse;INTW11;;2.9%25;;104;3;34;0;2;1;;29;;;5%0ADupont;Chlo%C3%A9;INTW5;;16.7%25;;96;3;7;2;10;7;;4;;;3%0ADupont;Ren%C3%A9e;INTW10;;2.9%25;;104;3;34;0;2;1;;29;;;5%0AFabres;Thierry;INTW7;;2.9%25;;104;3;34;0;2;1;;29;;;5%0ARenard;Bertrand;INTW8;;2.9%25;;104;3;34;0;2;1;;29;;;5%0ATotal%20organizational%20unit;;;;2.9%25;;208;22;111;;4;2;;29;60;12;10%0ATotal%20France;;;;2.9%25;;104;;34;0;2;1;;29;;;5';
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

it('Export table by site', async () => {
  const pathname = '/follow/sites/vqs2021x00';
  history.push(pathname);

  const component = render(
    <Router history={history}>
      <MonitoringTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  const realRemoveFunc = HTMLAnchorElement.prototype.remove;
  const removeElmMock = jest.fn();
  HTMLAnchorElement.prototype.remove = removeElmMock;

  const fileTitle = 'Everyday_life_and_health_survey_2021_Avancement_sites_8202020.csv';
  const fileContent = 'data:text/csv;charset=utf-8,%EF%BB%BFSite;;Completion%20rate;;Allocated;Not%20started;In%20progress%20by%20interviewer;Waiting%20for%20interviewer%20review;To%20review;Reviewed%20ended;;Preparing%20contact;At%20least%20one%20contact;Appointment%20taken;Interview%20started%0ANational%20organizational%20unit;;2.9%25;;104;22;47;0;2;1;;;30;12;5%0ANorth%20region%20organizational%20unit;;2.9%25;;104;22;47;;2;1;;;30;12;5%0ASouth%20region%20organizational%20unit;;2.9%25;;104;;64;0;2;1;;29;30;;5%0ATotal%20France;;2.9%25;;104;;34;0;2;1;;29;;;5';
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

it('Export table by survey for an interviewer', async () => {
  const pathname = '/follow/campaigns/interviewer/INTW5';
  history.push(pathname);

  const component = render(
    <Router history={history}>
      <MonitoringTable location={{ interviewer, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  const realRemoveFunc = HTMLAnchorElement.prototype.remove;
  const removeElmMock = jest.fn();
  HTMLAnchorElement.prototype.remove = removeElmMock;

  await waitForElement(() => screen.getByTestId('pagination-nav'));

  const fileTitle = 'Chloé_Dupont_Avancement_8202020.csv';
  const fileContent = 'data:text/csv;charset=utf-8,%EF%BB%BFSurvey;;Completion%20rate;;Allocated;Not%20started;In%20progress%20by%20interviewer;Waiting%20for%20interviewer%20review;To%20review;Reviewed%20ended;;Preparing%20contact;At%20least%20one%20contact;Appointment%20taken;Interview%20started%0AEveryday%20life%20and%20health%20survey%202018;;4.7%25;;720;21;211;2;22;13;;178;;;33%0AEveryday%20life%20and%20health%20survey%202021;;4.7%25;;720;21;211;2;22;13;;178;;;33%0AEveryday%20life%20and%20health%20survey%202022;;4.7%25;;720;21;211;2;22;13;;178;;;33%0AEveryday%20life%20and%20health%20survey%202026;;4.7%25;;720;21;211;2;22;13;;178;;;33%0ASurvey%20on%20something%202020;;4.7%25;;720;21;211;2;22;13;;178;;;33%0ASurvey%20on%20something%20else%202020;;4.7%25;;720;21;211;2;22;13;;178;;;33%0ASurvey%20on%20the%20Simpsons%20tv%20show%202020;;4.7%25;;720;21;211;2;22;13;;178;;;33%0ASurvey%20on%20the%20Simpsons%20tv%20show%202021;;4.7%25;;720;21;211;2;22;13;;178;;;33';
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

it('Export table by survey', async () => {
  const pathname = '/follow/campaigns';
  history.push(pathname);

  const component = render(
    <Router history={history}>
      <MonitoringTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  const realRemoveFunc = HTMLAnchorElement.prototype.remove;
  const removeElmMock = jest.fn();
  HTMLAnchorElement.prototype.remove = removeElmMock;

  await waitForElement(() => screen.getByTestId('pagination-nav'));

  const fileTitle = 'National_organizational_unit_Avancement_enquetes_8202020.csv';
  const fileContent = 'data:text/csv;charset=utf-8,%EF%BB%BFSurvey;;Completion%20rate;;Allocated;Not%20started;In%20progress%20by%20interviewer;Waiting%20for%20interviewer%20review;To%20review;Reviewed%20ended;;Preparing%20contact;At%20least%20one%20contact;Appointment%20taken;Interview%20started%0AEveryday%20life%20and%20health%20survey%202018;;4.7%25;;720;21;211;2;22;13;;178;;;33%0AEveryday%20life%20and%20health%20survey%202021;;4.7%25;;720;21;211;2;22;13;;178;;;33%0AEveryday%20life%20and%20health%20survey%202022;;4.7%25;;720;21;211;2;22;13;;178;;;33%0AEveryday%20life%20and%20health%20survey%202026;;4.7%25;;720;21;211;2;22;13;;178;;;33%0ASurvey%20on%20something%202020;;4.7%25;;720;21;211;2;22;13;;178;;;33%0ASurvey%20on%20something%20else%202020;;4.7%25;;720;21;211;2;22;13;;178;;;33%0ASurvey%20on%20the%20Simpsons%20tv%20show%202020;;4.7%25;;720;21;211;2;22;13;;178;;;33%0ASurvey%20on%20the%20Simpsons%20tv%20show%202021;;4.7%25;;720;21;211;2;22;13;;178;;;33';
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