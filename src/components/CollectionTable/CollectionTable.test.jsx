// Link.react.test.js
import 'core-js';
import React from 'react';
import {
  render, screen, fireEvent, cleanup, waitForElement,
} from '@testing-library/react';
import { Router, Route, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import DataFormatter from '../../utils/DataFormatter';
import CollectionTable from './CollectionTable';
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
  respModeByInterviewers1SurveyCollectionTable,
  respModeBySiteCollectionTable,
  respModeBySurveyCollectionTable,
  respModeBySurveyOneInterviewerCollectionTable,
  mainScreenData,
} = mocks;

const TestingRouter = ({ ComponentWithRedirection }) => (
  <Router history={history}>
    <Switch>
      <Route exact path="/collection/campaign/vqs2021x00" component={() => <ComponentWithRedirection />} />
      <Route exact path="/collection/sites/vqs2021x00" component={() => <ComponentWithRedirection />} />
      <Route exact path="/collection/campaigns/interviewer/INTW7" component={() => <ComponentWithRedirection />} />
      <Route exact path="/collection/campaigns/interviewer/INTW5" component={() => <ComponentWithRedirection />} />
      <Route exact path="/collection/campaigns" component={() => <ComponentWithRedirection />} />
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

const mockGetDataForCollectionTable = jest.fn(
  (survey, date, pagination, mode, cb) => {
    switch(mode){
      case C.BY_INTERVIEWER_ONE_SURVEY: 
        cb(respModeByInterviewers1SurveyCollectionTable);
        break;
      case C.BY_SITE: 
        cb(respModeBySiteCollectionTable);
        break;
      case C.BY_SURVEY:
        cb(respModeBySurveyCollectionTable);
        break;
      case C.BY_SURVEY_ONE_INTERVIEWER: 
        cb(respModeBySurveyOneInterviewerCollectionTable);
        break;
        
    }
  } 
);

const mockDataFormatter = DataFormatter.mockImplementation(() => ({
  getDataForCollectionTable: mockGetDataForCollectionTable,
  getDataForMainScreen: mockGetDataForMainScreen,
}));

const mockDataRetreiver = new DataFormatter();

it('Component is correctly displayed', async () => {
  const pathname = '/collection/campaign/vqs2021x00';
  history.push(pathname);
  const component = render(
    <Router history={history}>
      <CollectionTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  // Should match snapshot (rows displayed)
  expect(component).toMatchSnapshot();
});

it('Sort by interviewer name', async () => {
  const pathname = '/collection/campaign/vqs2021x00';
  history.push(pathname);
  const component = render(
    <Router history={history}>
      <CollectionTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  screen.getByTestId('TableHeader_label').click();
  // Should match snapshot (rows sorted by name)
  expect(component).toMatchSnapshot();
});

it('Change page', async () => {
  const pathname = '/collection/campaign/vqs2021x00';
  history.push(pathname);
  const component = render(
    <Router history={history}>
      <CollectionTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  screen.getByTestId('pagination-nav').lastChild.firstChild.click();

  // Should match snapshot (rows displayed have changed)
  expect(component).toMatchSnapshot();
});

it('Change pagination size', async () => {
  const pathname = '/collection/campaign/vqs2021x00';
  history.push(pathname);
  const component = render(
    <Router history={history}>
      <CollectionTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  fireEvent.change(component.getByTestId('pagination-size-selector'), { target: { value: '10' } });

  // Should match snapshot (all rows are now displayed)
  expect(component).toMatchSnapshot();
});

it('Select another survey (by interviewer)', async () => {

  const pathname = '/collection/campaign/vqs2021x00';
  history.push(pathname);

  const redirectUrl = '/collection/campaign/simpsons2020x00';

  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        () => <CollectionTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
      }
    />,
  );

  fireEvent.change(component.getByTestId('Survey_selector'), { target: { value: 'simpsons2020x00' } });

  // Should redirect to '/collection/campaign/simpsons2020x00'
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);

  // Location should contain survey object
  expect(screen.getByTestId('Redirect-survey').innerHTML).not.toEqual('');
  expect(screen.getByTestId('Redirect-survey')).toMatchSnapshot();
});

it('Select another survey (by site)', async () => {
  const pathname = '/collection/sites/vqs2021x00';
  history.push(pathname);

  const redirectUrl = '/collection/sites/simpsons2020x00';

  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        () => <CollectionTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
      }
    />,
  );

  fireEvent.change(component.getByTestId('Survey_selector'), { target: { value: 'simpsons2020x00' } });

  // Should redirect to '/collection/campaign/simpsons2020x00'
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);

  // Location should contain survey object
  expect(screen.getByTestId('Redirect-survey').innerHTML).not.toEqual('');
  expect(screen.getByTestId('Redirect-survey')).toMatchSnapshot();
});

it('Select another date', async () => {
  const pathname = '/collection/campaign/vqs2021x00';
  history.push(pathname);

  const component = render(
    <Router history={history}>
      <CollectionTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  fireEvent.change(component.getByTestId('date-picker'), { target: { value: '2020-02-20' } });

  // getDataForCollectionTable should have been called with the new date
  expect(mockGetDataForCollectionTable).toHaveBeenLastCalledWith(
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
  const pathname = '/collection/campaign/vqs2021x00';
  history.push(pathname);

  const { container } = render(
    <Router history={history}>
      <CollectionTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  render(
    <Router history={history}>
      <CollectionTable location={{ survey, pathname: '/collection/sites/simpsons2020x00' }} dataRetreiver={mockDataRetreiver} />
    </Router>,
    { container },
  );

  // getDataForCollectionTable should have been called again with the mode by site
  expect(mockGetDataForCollectionTable).toHaveBeenLastCalledWith(
    expect.anything(),
    expect.anything(),
    expect.anything(),
    C.BY_SITE,
    expect.anything(),
  );
})

it('Reloading the page with no survey set (F5) by interviewer 1 survey (Campaign > Progress by interviewer)', async () => {

  const pathname = '/collection/campaign/vqs2021x00';
  //history.push(pathname);

  const redirectUrl = '/';

  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        () => <CollectionTable location={{ pathname }} dataRetreiver={mockDataRetreiver} />
      }
    />,
  );

  // Should redirect to '/'
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Reloading the page with no survey set (F5) by site (Campaign > Progress by site)', async () => {

  const pathname = '/collection/sites/vqs2021x00';
  history.push(pathname);

  const redirectUrl = '/';

  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        () => <CollectionTable location={{ pathname }} dataRetreiver={mockDataRetreiver} />
      }
    />,
  );

  // Should redirect to '/'
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Reloading the page with no survey set (F5) by survey for an interviewer (Interviewer > Progress by campaign)', async () => {
  const pathname = '/collection/campaigns/interviewer/INTW7';
  history.push(pathname);

  const redirectUrl = '/';

  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        () => <CollectionTable location={{ pathname }} dataRetreiver={mockDataRetreiver} />
      }
    />,
  );

  // Should redirect to '/'
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Reloading the page with no survey set (F5) by survey (Site > Progress)', async () => {
  const pathname = '/collection/campaigns';
  history.push(pathname);

  const component = render(
    <Router history={history}>
      <CollectionTable location={{ pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  await waitForElement(() => screen.getByTestId('pagination-nav'));

  // Should call getDataForMainScreen and display the page anyway
  expect(mockGetDataForMainScreen).toHaveBeenCalled();
  expect(component).toMatchSnapshot();
});

it('Export table by interviewer one survey', async () => {
  const pathname = '/collection/campaign/vqs2021x00';
  history.push(pathname);

  const component = render(
    <Router history={history}>
      <CollectionTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  const realRemoveFunc = HTMLAnchorElement.prototype.remove;
  const removeElmMock = jest.fn();
  HTMLAnchorElement.prototype.remove = removeElmMock;

  const fileTitle = 'National_organizational_unit_Everyday_life_and_health_survey_2021_Avancement_collecte_enqueteurs_8202020.csv';
  const fileContent = 'data:text/csv;charset=utf-8,%EF%BB%BFLast%20name;First%20name;Idep;;Collection%20rate;Waste%20rate;Out%20of%20scope%20rate;;Surveys%20accepted;Refusal;Unreachable;Other%20wastes;Out%20of%20scope;Total%20processed;;Absence%20interviewer;Other%20reason;Total%20closed;;Allocated%0ABoulanger;Emilie;INTW9;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104%0ABoulanger;Jacques;INTW6;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104%0ADelmarre;Alphonse;INTW11;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104%0ADupont;Chlo%C3%A9;INTW5;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104%0ADupont;Ren%C3%A9e;INTW10;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104%0AFabres;Thierry;INTW7;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104%0ARenard;Bertrand;INTW8;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104%0ATotal%20organizational%20unit;;;;32.4%25;38.5%25;7.7%25;;66;4;10;54;16;6;;4;8;12;;208%0AUnits%20not%20affected;;;;31.7%25;33.7%25;7.7%25;;33;2;5;27;8;3;;0;1;1;;104%0ATotal%20France;;;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104';
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
  const pathname = '/collection/sites/vqs2021x00';
  history.push(pathname);

  const component = render(
    <Router history={history}>
      <CollectionTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  const realRemoveFunc = HTMLAnchorElement.prototype.remove;
  const removeElmMock = jest.fn();
  HTMLAnchorElement.prototype.remove = removeElmMock;

  const fileTitle = 'Everyday_life_and_health_survey_2021_Avancement_collecte_sites_8202020.csv';
  const fileContent = 'data:text/csv;charset=utf-8,%EF%BB%BFSite;;Collection%20rate;Waste%20rate;Out%20of%20scope%20rate;;Surveys%20accepted;Refusal;Unreachable;Other%20wastes;Out%20of%20scope;Total%20processed;;Absence%20interviewer;Other%20reason;Total%20closed;;Allocated%0ANational%20organizational%20unit;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104%0ANorth%20region%20organizational%20unit;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104%0ASouth%20region%20organizational%20unit;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104%0ATotal%20France;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104';
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
  const pathname = '/collection/campaigns/interviewer/INTW5';
  history.push(pathname);

  const component = render(
    <Router history={history}>
      <CollectionTable location={{ interviewer, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  const realRemoveFunc = HTMLAnchorElement.prototype.remove;
  const removeElmMock = jest.fn();
  HTMLAnchorElement.prototype.remove = removeElmMock;

  await waitForElement(() => screen.getByTestId('pagination-nav'));

  const fileTitle = 'Chloé_Dupont_Avancement_collecte_8202020.csv';
  const fileContent = 'data:text/csv;charset=utf-8,%EF%BB%BFSurvey;;Collection%20rate;Waste%20rate;Out%20of%20scope%20rate;;Surveys%20accepted;Refusal;Unreachable;Other%20wastes;Out%20of%20scope;Total%20processed;;Absence%20interviewer;Other%20reason;Total%20closed;;Allocated%0AEveryday%20life%20and%20health%20survey%202021;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104%0ASurvey%20on%20something%202020;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104%0ASurvey%20on%20the%20Simpsons%20tv%20show%202020;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104';
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
  const pathname = '/collection/campaigns';
  history.push(pathname);

  const component = render(
    <Router history={history}>
      <CollectionTable location={{ survey, pathname }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  const realRemoveFunc = HTMLAnchorElement.prototype.remove;
  const removeElmMock = jest.fn();
  HTMLAnchorElement.prototype.remove = removeElmMock;

  await waitForElement(() => screen.getByTestId('pagination-nav'));

  const fileTitle = 'National_organizational_unit_Avancement_collecte_enquetes_8202020.csv';
  const fileContent = 'data:text/csv;charset=utf-8,%EF%BB%BFSurvey;;Collection%20rate;Waste%20rate;Out%20of%20scope%20rate;;Surveys%20accepted;Refusal;Unreachable;Other%20wastes;Out%20of%20scope;Total%20processed;;Absence%20interviewer;Other%20reason;Total%20closed;;Allocated%0AEveryday%20life%20and%20health%20survey%202018;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104%0AEveryday%20life%20and%20health%20survey%202022;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104%0AEveryday%20life%20and%20health%20survey%202026;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104%0ASurvey%20on%20something%202020;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104%0ASurvey%20on%20something%20else%202020;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104%0ASurvey%20on%20the%20Simpsons%20tv%20show%202020;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104%0ASurvey%20on%20the%20Simpsons%20tv%20show%202021;;32.4%25;38.5%25;7.7%25;;33;2;5;27;8;3;;2;4;6;;104';
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