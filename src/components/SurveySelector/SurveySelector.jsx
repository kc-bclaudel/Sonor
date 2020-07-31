import React from 'react';
import Form from 'react-bootstrap/Form';
import D from '../../i18n';

function createSelectOptions(campaigns, currentId) {
  const options = [];
  campaigns.forEach((campaign, index) => {
    if (campaign.id !== currentId) {
      options.push(<option key={campaign.id} value={index}>{campaign.label}</option>);
    }
  });
  return options;
}

function switchCurrent(surveyObj, indexToSwitch) {
  const switched = {};
  Object.assign(switched, surveyObj);
  const newSurvey = surveyObj.allSurveys[indexToSwitch];
  switched.id = newSurvey.id;
  switched.label = newSurvey.label;
  switched.visibilityStartDate = newSurvey.visibilityStartDate;
  switched.treatmentEndDate = newSurvey.treatmentEndDate;
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
        >
          <option disabled value={-1} key={-1}>{D.chooseASurvey}</option>
          {createSelectOptions(survey.allSurveys, survey.id)}
        </Form.Control>
      </Form.Group>
    </Form>
  );
}

export default SurveySelector;
