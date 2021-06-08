import React from 'react';
import Form from 'react-bootstrap/Form';
import D from '../../i18n';

function createSelectOptions(campaigns, currentId) {
  return campaigns
    .filter((campaign) => (campaign.id !== currentId))
    .sort((a, b) => (a.label > b.label ? 1 : -1))
    .map((campaign) => (<option key={campaign.id} value={campaign.id}>{campaign.label}</option>));
}

function switchCurrent(surveyObj, idToSwitch) {
  const switched = {};
  Object.assign(switched, surveyObj);
  const newSurvey = surveyObj.allSurveys.find((survey) => survey.id === idToSwitch);
  switched.id = newSurvey.id;
  switched.label = newSurvey.label;
  switched.collectionStartDate = newSurvey.collectionStartDate;
  switched.endDate = newSurvey.endDate;
  return switched;
}

function SurveySelector({ survey, updateFunc }) {
  return (
    <Form>
      <Form.Group>
        <Form.Control
          as="select"
          size="sm"
          custom
          placeholder={D.chooseASurvey}
          value={-1}
          onChange={(e) => updateFunc(switchCurrent(survey, e.target.value), e.target.value)}
          data-testid="Survey_selector"
        >
          <option disabled value={-1} key={-1}>{D.chooseASurvey}</option>
          {createSelectOptions(survey.allSurveys, survey.id)}
        </Form.Control>
      </Form.Group>
    </Form>
  );
}

export default SurveySelector;
