import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Redirect } from 'react-router-dom';

import SurveySelector from '../SurveySelector/SurveySelector';
import InterviewerSelector from '../InterviewerSelector/InterviewerSelector';

function ModalSelection({
  linkTo, title, show, setShow, dataRetreiver, interviewerMode,
}) {
  const [redirect, setRedirect] = useState(null);
  const [surveys, setSurveys] = useState(null);
  const [interviewers, setInterviewers] = useState(null);

  const updateSurveys = useCallback(() => {
    dataRetreiver.getDataForMainScreen(null, (data) => {
      setSurveys({
        allSurveys: data.filter(
          (survey) => survey.preference,
        ),
      });
    });
  }, [dataRetreiver]);

  const updateInterviewers = useCallback(() => {
    dataRetreiver.getInterviewers((data) => {
      setInterviewers({ allInterviewers: data });
    });
  }, [dataRetreiver]);

  useEffect(() => {
    if (interviewerMode) {
      updateInterviewers();
    } else {
      updateSurveys();
    }
  }, [dataRetreiver, updateSurveys, updateInterviewers, interviewerMode]);


  useEffect(() => {
    setRedirect(null);
    if (!interviewerMode) {
      updateSurveys();
    }
  }, [show, interviewerMode, updateSurveys]);

  return redirect
    ? <Redirect to={redirect} />
    : (!show || (interviewerMode && !interviewers) || (
      <>
        <Modal
          show={show}
          onHide={() => setShow(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              interviewerMode
                ? (
                  <InterviewerSelector
                    interviewer={interviewers}
                    updateFunc={(newInterviewer) => {
                      setRedirect({ pathname: `/${linkTo}/${newInterviewer.id}`, interviewer: newInterviewer });
                      setShow(false);
                    }}
                  />
                )
                : (
                  <SurveySelector
                    survey={surveys}
                    updateFunc={(newSurvey) => {
                      setRedirect({ pathname: `/${linkTo}/${newSurvey.id}`, survey: newSurvey });
                      setShow(false);
                    }}
                  />
                )
            }
          </Modal.Body>
        </Modal>
      </>
    ));
}

export default ModalSelection;
