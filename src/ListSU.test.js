// Link.react.test.js
import React from 'react';
import ListSU from './ListSU.js';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

test('Survey unit list rendering no data', () => {
  const component = renderer.create(
    <ListSU survey='vqs2021x00' data={[]} returnToMainScreen={()=>{()=>{}}}/>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

});