// Link.react.test.js
import React from 'react';
import {
  render, screen, cleanup,
} from '@testing-library/react';
import ModalPreferences from './ModalPreferences';
import mocks from '../../tests/mocks';

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

const { preferences } = mocks;
const hidePreferences = jest.fn();
const updatePreferences = jest.fn();

it('Component is correctly displayed', async () => {
  const component = render(
    <ModalPreferences
      preferences={preferences}
      showPreferences
      hidePreferences={hidePreferences}
      updatePreferences={updatePreferences}
    />,
  );
  // Should match snapshot
  expect(component).toMatchSnapshot();
});

it('Component not displayed when showPreferences is false', async () => {
  const component = render(
    <ModalPreferences
      preferences={preferences}
      showPreferences={false}
      hidePreferences={hidePreferences}
      updatePreferences={updatePreferences}
    />,
  );

  // Modal should not be displayed
  expect(component.baseElement.querySelector('.modal-open')).not.toBeTruthy();
});

it('Check a box, uncheck another, validate', async () => {
  const component = render(
    <ModalPreferences
      preferences={preferences}
      showPreferences
      hidePreferences={hidePreferences}
      updatePreferences={updatePreferences}
    />,
  );

  const boxes = component.baseElement.querySelectorAll('input[type="checkbox"]');

  boxes[1].click();
  boxes[2].click();

  const newPrefs = [
    'vqs2021x00',
    'simpsonkgs2020x00',
  ];

  screen.getByTestId('validate-pref-modif').click();

  // updatePreferences should have been called with the new pref surveys in argument
  expect(updatePreferences).toHaveBeenLastCalledWith(newPrefs);
});

it('Close modal with cross', async () => {
  const component = render(
    <ModalPreferences
      preferences={preferences}
      showPreferences
      hidePreferences={hidePreferences}
      updatePreferences={updatePreferences}
    />,
  );

  component.baseElement.querySelector('button.close').click();

  // Hide preferences should be called
  expect(hidePreferences).toHaveBeenCalled();
});

it('Close modal with button', async () => {
  render(
    <ModalPreferences
      preferences={preferences}
      showPreferences
      hidePreferences={hidePreferences}
      updatePreferences={updatePreferences}
    />,
  );

  screen.getByTestId('close-preferences-button').click();

  // hidePreferences should be called
  expect(hidePreferences).toHaveBeenCalled();
});
