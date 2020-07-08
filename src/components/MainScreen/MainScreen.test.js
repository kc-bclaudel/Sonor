// Link.react.test.js
import React from 'react';
import MainScreen from './MainScreen.js';
import renderer from 'react-test-renderer';

const mockStudyLine1 = {
		  study: 'Mobilité des personnes 2018',
		  collectionStart: '15/10/2019',
		  collectionEnd: '15/10/2019',
		  endOfProcess: '15/10/2019',
		  phase: 'Collecte en cours',
		  affected:108,
		  toBeAffected: 0,
		  ongoing:99,
		  toBeControled:0
		}

		const mockStudyLine2 = {
		  study: 'Habitudes de vie 2019',
		  collectionStart: '07/01/2019',
		  collectionEnd: '12/03/2019',
		  endOfProcess: '17/11/2019',
		  phase: 'Collecte en cours',
		  affected:134,
		  toBeAffected: 21,
		  ongoing:55,
		  toBeControled:2
		}




test('Mainscreen rendering, no data', () => {
  const component = renderer.create(
    <MainScreen 
                data={[]}
                goToSurveyPortal={(surveyId)=>{}}
                goToListSU={(surveyId)=>{}}
                goToMonitoringTable={(surveyId)=>{}}
              />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

});


test('Mainscreen rendering, 2 surveys', () => {
  const component = renderer.create(
    <MainScreen 
                data={[mockStudyLine1, mockStudyLine2]}
                goToSurveyPortal={(surveyId)=>{}}
                goToListSU={(surveyId)=>{}}
                goToMonitoringTable={(surveyId)=>{}}
              />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

});

