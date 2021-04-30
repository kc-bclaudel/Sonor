// Link.react.test.js
import React from 'react';
import {
  render, screen, fireEvent, cleanup,
} from '@testing-library/react';
import { Router, Route, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import DataFormatter from '../../utils/DataFormatter';
import CampaignPortal from './CampaignPortal';
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
  history.push('/portal/vqs2021x00');
});

afterEach(cleanup);

jest.mock('../../utils/DataFormatter');

const survey = mocks.surveyVqs;
const { surveyInfo, surveyInfoPhaseIni, surveyInfoPhaseOngoing } = mocks;
const resp = mocks.campaignPortalData;

const TestingRouter = ({ ComponentWithRedirection }) => (
  <Router history={history}>
    <Switch>
      <Route path="/portal/vqs2021x00" render={() => <ComponentWithRedirection />} />
      <Route
        path="*"
        component={(routeProps) => (
          <div>
            <div data-testid="Redirect-url">{JSON.stringify(routeProps.history.location.pathname)}</div>
            <div data-testid="Redirect-surveyInfos">{!routeProps.history.location || !routeProps.history.location.surveyInfos || JSON.stringify(routeProps.history.location.surveyInfos)}</div>
          </div>
        )}
      />
    </Switch>
  </Router>
);

DataFormatter.mockImplementation(() => ({
  getDataForCampaignPortal: (id, cb) => (cb(resp)),
}));

const mockDataRetreiver = new DataFormatter();

it('Component is correctly displayed', async () => {
  const component = render(
    <Router history={history}>
      <CampaignPortal
        location={{ surveyInfos: { survey, surveyInfo } }}
        dataRetreiver={mockDataRetreiver}
      />
    </Router>,
  );

  // Should match snapshot (rows displayed)
  expect(component).toMatchSnapshot();
});

it('TimeLine Phase initial allocation', async () => {
  const component = render(
    <Router history={history}>
      <CampaignPortal
        location={{ surveyInfos: { survey, surveyInfo: surveyInfoPhaseIni } }}
        dataRetreiver={mockDataRetreiver}
      />
    </Router>,
  );

  // Should match snapshot (class currentPhase is well placed)
  expect(component).toMatchSnapshot();
});

it('TimeLine Phase ongoing', async () => {
  const component = render(
    <Router history={history}>
      <CampaignPortal
        location={{ surveyInfos: { survey, surveyInfo: surveyInfoPhaseOngoing } }}
        dataRetreiver={mockDataRetreiver}
      />
    </Router>,
  );

  // Should match snapshot (class currentPhase is well placed)
  expect(component).toMatchSnapshot();
});

it('Sort SUs by interviewer name', async () => {
  const component = render(
    <Router history={history}>
      <CampaignPortal
        location={{ surveyInfos: { survey, surveyInfo } }}
        dataRetreiver={mockDataRetreiver}
      />
    </Router>,
  );

  screen.getByTestId('TableHeader_interviewer_name_portal').click();
  // Should match snapshot (rows sorted by name)
  expect(component).toMatchSnapshot();
});

it('Change page', async () => {
  const component = render(
    <Router history={history}>
      <CampaignPortal
        location={{ surveyInfos: { survey, surveyInfo } }}
        dataRetreiver={mockDataRetreiver}
      />
    </Router>,
  );

  screen.getByTestId('pagination-nav').lastChild.firstChild.click();

  // Should match snapshot (rows displayed have changed)
  expect(component).toMatchSnapshot();
});

it('Change pagination size', async () => {
  const component = render(
    <Router history={history}>
      <CampaignPortal
        location={{ surveyInfos: { survey, surveyInfo } }}
        dataRetreiver={mockDataRetreiver}
      />
    </Router>,
  );

  fireEvent.change(component.getByTestId('pagination-size-selector'), { target: { value: '20' } });

  // Should match snapshot (all rows are now displayed)
  expect(component).toMatchSnapshot();
});

it('Select another survey', async () => {

  const redirectUrl = '/portal/simpsons2020x00';
  const component = render(
    <TestingRouter
      ComponentWithRedirection={
        () => (
          <CampaignPortal
            location={{ surveyInfos: { survey, surveyInfo } }}
            dataRetreiver={mockDataRetreiver}
          />
        )
      }
    />,
  );

  fireEvent.change(component.getByTestId('Survey_selector'), { target: { value: 'simpsons2020x00' } });

  // Should redirect to '/listSU/simpsons2020x00'
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);

  // Location should contain survey object
  expect(screen.getByTestId('Redirect-surveyInfos').innerHTML).not.toEqual('');
  expect(screen.getByTestId('Redirect-surveyInfos')).toMatchSnapshot();
});

it('Reloading the page with no survey set (F5)', async () => {
  const pathname = '/portal/vqs2021x00';
  const redirectUrl = '/';
  render(
    <TestingRouter
      ComponentWithRedirection={
        () => (
          <CampaignPortal
            location={{ pathname }}
            dataRetreiver={mockDataRetreiver}
          />
        )
      }
    />,
  );

  // Should redirect to '/'
  expect(screen.getByTestId('Redirect-url').innerHTML).toEqual(`\"${redirectUrl}\"`);
});

it('Export table', async () => {
  const component = render(
    <Router history={history}>
      <CampaignPortal
        location={{ surveyInfos: { survey, surveyInfo } }}
        dataRetreiver={mockDataRetreiver}
      />
    </Router>,
  );

  const realRemoveFunc = HTMLAnchorElement.prototype.remove;
  const removeElmMock = jest.fn();
  HTMLAnchorElement.prototype.remove = removeElmMock;

  const fileTitle = 'National_organizational_unit_Everyday_life_and_health_survey_2021_Repartition_enqueteurs_8202020.csv';
  const fileContent = 'data:text/csv;charset=utf-8,%EF%BB%BFInterviewer;Idep;SU%0ABoulanger%20Emilie;INTW9;55%0ABoulanger%20Jacques;INTW6;55%0ADelmarre%20Alphonse;INTW11;55%0ADupont%20Chlo%C3%A9;INTW5;84%0ADupont%20Ren%C3%A9e;INTW10;84%0AFabres%20Thierry;INTW7;76%0ARenard%20Bertrand;INTW8;84%0AUnassigned;%20;14%0AAbandoned;%20;%0ATotal%20organizational%20unit;%20;208';
  screen.getByText('Export').click();
  const downnloadLink = component.baseElement.querySelector('a[download]');

  // Check that file title is correct
  expect(downnloadLink.getAttribute('download')).toEqual(fileTitle);

  // Check that file content is correct
  expect(downnloadLink.getAttribute('href')).toEqual(fileContent);

  // Should match snapshot (with link attached)
  expect(component).toMatchSnapshot();

  HTMLAnchorElement.prototype.remove = realRemoveFunc;
  downnloadLink.remove();
});

it('Send mail', async () => {
  render(
    <Router history={history}>
      <CampaignPortal
        location={{ surveyInfos: { survey, surveyInfo } }}
        dataRetreiver={mockDataRetreiver}
      />
    </Router>,
  );

  Object.defineProperty(window.location, 'assign', {
    configurable: true,
  });
  window.location.assign = jest.fn();

  screen.getByTestId('mail-button').click();

  // Check that the link to send mail has been triggered
  expect(window.location.assign).toHaveBeenCalledWith('mailto:survey@mail.com');
});