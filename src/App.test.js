import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import App from './App';
import ListSU from './ListSU'


// const displaySurveyLines = ListSU.__get__("displaySurveyLines");


// var rewire = require('rewire');
// var app = rewire('./ListSU.js');
// displaySurveyLines = app.__get__('displaySurveyLines'); 
// test('renders learn react link', () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});


// test('adds 1 + 2 to equal 3', () => {
//   expect(displaySurveyLines({data:[]})).toStrictEqual([]);
// });