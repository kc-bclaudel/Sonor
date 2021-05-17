// Link.react.test.js
import React from 'react';
import {
  render, fireEvent, cleanup,
} from '@testing-library/react';
import SearchField from './SearchField';

afterEach(cleanup);

const data = [{"campaignLabel":"Survey on the Simpsons tv show 2020","interviewer":"Dupont Chloé","idep":"INTW5","id":"1032"},{"campaignLabel":"test abc","interviewer":"Boulanger Jacques","idep":"INTW6","id":"4818"}];

const updateFunc = jest.fn();

it('Filter by idep and campaignLabel', async () => {
  const component = render(
    <SearchField
      data={data}
      searchBy={['idep', 'campaignLabel']}
      updateFunc={updateFunc}
    />,
  );

  fireEvent.change(component.baseElement.querySelector('input'), { target: { value: 'survey' } });

  // Should match first element
  expect(updateFunc).toHaveBeenLastCalledWith([data[0]]);

  fireEvent.change(component.baseElement.querySelector('input'), { target: { value: 'hello' } });

  // Should match no elements
  expect(updateFunc).toHaveBeenLastCalledWith([]);

  fireEvent.change(component.baseElement.querySelector('input'), { target: { value: 'INTW6' } });

  // Should match second element
  expect(updateFunc).toHaveBeenLastCalledWith([data[1]]);

});