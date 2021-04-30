// Link.react.test.js
import React from 'react';
import { act } from 'react-dom/test-utils';
import {
  render, screen, fireEvent, cleanup, waitForElement, wait,
} from '@testing-library/react';
import { Router, Route, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import DataFormatter from '../../utils/DataFormatter';
import Notifications from './Notifications';
import mocks from '../../tests/mocks';
import userEvent from '@testing-library/user-event';

import {mount, configure} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import waitUntil from 'async-wait-until';

configure({adapter: new Adapter()});


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

(global).document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

const OriginalDate = global.Date;
jest
  .spyOn(global, 'Date')
  .mockImplementation((a) => (a ? new OriginalDate(a) : new OriginalDate('2020-08-20T11:01:58.135Z')));
Date.now = jest.fn(() => 1597916474000);

beforeEach(() => {
  history.push('/notifications');
});

afterEach(cleanup);

jest.mock('../../utils/DataFormatter');

const survey = mocks.surveyVqs;
const resp = mocks.listSU;
const { messageHistory, verifyNameResp } = mocks;

const TestingRouter = ({ ComponentWithRedirection }) => (
  <Router history={history}>
    <Switch>
      <Route path="/notifications" component={() => <ComponentWithRedirection />} />
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
const postMessageMock = jest.fn();
const verifyNameMock = jest.fn((q, c) => (c(verifyNameResp)));
DataFormatter.mockImplementation(() => ({
  getMessageHistory: (c) => (c(messageHistory)),
  verifyName: verifyNameMock,
  postMessage: postMessageMock,
}));

const mockDataRetreiver = new DataFormatter();

it('Component is correctly displayed', async () => {
  const component = render(
    <Router history={history}>
      <Notifications user={{ id: 'test' }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  // Should match snapshot (rows displayed)
  expect(component).toMatchSnapshot();
});

it('Change page', async () => {
  const component = render(
    <Router history={history}>
      <Notifications user={{ id: 'test' }} dataRetreiver={mockDataRetreiver} />
    </Router>,
  );

  screen.getByTestId('pagination-nav').lastChild.firstChild.click();

  // Should match snapshot (rows displayed have changed)
  expect(component).toMatchSnapshot();
});

it('Send message', async () => {
  // Using enzyme library for this test

  const wrapper = mount(
    <Router history={history}>
      <Notifications user={{ id: 'test' }} dataRetreiver={mockDataRetreiver} />
    </Router>
  );
  // Triggering the suggestion search by simulating input in typeahead component
  const input = wrapper.find('.rbt-input-main');
  const event = {
    defaultPrevented: false,
    persist: () => {},
    preventDefault: () => {},
  };
  const inputEvent = {
    defaultPrevented: false,
    persist: () => {},
    preventDefault: () => {},
    currentTarget: { value: 'm' },
  };
  input.prop('onChange')(inputEvent);

  // VerifyName should have been called
  expect(verifyNameMock).toHaveBeenLastCalledWith(
    'm',
    expect.anything(),
  );

  // Writting a message in the textArea
  const messageInput = wrapper.find('#message');
  messageInput.simulate('change', { target: { value: 'a message' } });

  // focus is needed to trigger the suggestion overlay
  input.simulate('focus', event);
  // Choosing the first suggestion by clicking on it
  const option = wrapper.find('#async-typehead-item-0.dropdown-item');
  option.simulate('click');

  const sendbtn = wrapper.find('#sendButton').first();
  sendbtn.simulate('click');

  expect(postMessageMock).toHaveBeenLastCalledWith(
    { recipients: ['INTW1'], sender: 'test', text: 'a message' },
    expect.anything(),
  );

});
