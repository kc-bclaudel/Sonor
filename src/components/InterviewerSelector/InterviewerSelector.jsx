import React from 'react';
import Form from 'react-bootstrap/Form';
import D from '../../i18n';

function createSelectOptions(allInterviewers, currentId) {
  return allInterviewers
    .filter((interviewer) => (interviewer.id !== currentId))
    .sort((a, b) => (`${a.interviewerLastName} ${a.interviewerFirstName}` > `${b.interviewerLastName} ${b.interviewerFirstName}` ? 1 : -1))
    .map((interviewer) => (
      <option key={interviewer.id} value={interviewer.id}>
        {`${interviewer.interviewerFirstName} ${interviewer.interviewerLastName}`}
      </option>
    ));
}

function switchCurrent(interviewerObj, idToSwitch) {
  const switched = {};
  Object.assign(switched, interviewerObj);
  const newInterviewer = interviewerObj.allInterviewers.find(
    (interviewer) => interviewer.id === idToSwitch,
  );
  switched.id = newInterviewer.id;
  switched.interviewerFirstName = newInterviewer.interviewerFirstName;
  switched.interviewerLastName = newInterviewer.interviewerLastName;
  return switched;
}

function InterviewerSelector({ interviewer, updateFunc }) {
  return (
    <Form>
      <Form.Group>
        <Form.Control
          as="select"
          size="sm"
          custom
          placeholder={D.chooseAInterviewer}
          value={-1}
          onChange={(e) => updateFunc(switchCurrent(interviewer, e.target.value), e.target.value)}
          data-testid="Interviewer_selector"
        >
          <option disabled value={-1} key={-1}>{D.chooseAnInterviewer}</option>
          {createSelectOptions(interviewer.allInterviewers, interviewer.id)}
        </Form.Control>
      </Form.Group>
    </Form>
  );
}

export default InterviewerSelector;
