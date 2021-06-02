import React, { useState, useEffect, useCallback } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, Redirect } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import SurveySelector from '../SurveySelector/SurveySelector';
import ReviewTable from './ReviewTable';
import Utils from '../../utils/Utils';
import D from '../../i18n';
import './Review.css';

function Review({
  location, dataRetreiver, match,
}) {
  const { survey } = location;
  const { id } = match.params;
  const [data, setData] = useState([]);
  const [sort, setSort] = useState({ sortOn: 'interviewer', asc: true });
  const [redirect, setRedirect] = useState(!survey && id ? '/' : null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    let surveyId = null;
    if (survey) surveyId = survey.id;
    dataRetreiver.getDataForReview(surveyId, (res) => {
      setData(res);
      setRedirect(null);
      setIsLoading(false);
    });
  }, [dataRetreiver, survey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function validateSU(lstSUFinalized) {
    dataRetreiver.finalizeSurveyUnits(lstSUFinalized)
      .then((response) => {
        if (response.some(
          (res) => !(res.status === 200 || res.status === 201 || res.status === 204),
        )) {
          NotificationManager.error(`${D.reviewAlertError}: ${lstSUFinalized
            .filter((x, index) => !(response[index].status === 200 || response[index].status === 201 || response[index].status === 204)).join(', ')}.`, D.error, 3500);
        } else {
          NotificationManager.success(`${D.reviewAlertSuccess}: ${lstSUFinalized.join(', ')}.`, D.updateSuccess, 3500);
        }
        fetchData();
      });
  }

  function viewSU(suId) {
    dataRetreiver.updateSurveyUnitViewed(suId);
    fetchData();
  }

  function validateUpdateComment(suToModifySelected, comment) {
    dataRetreiver.updateSurveyUnitsComment(suToModifySelected, comment)
      .then((res) => {
        if (res.status === 200 || res.status === 201 || res.status === 204) {
          NotificationManager.success(D.commentUpdateSuccess, D.updateSuccess, 3500);
        } else {
          NotificationManager.error(D.commentUpdateError, D.error, 3500);
        }
        fetchData();
      });
  }

  const handleSort = useCallback((property, asc) => {
    const [sortedData, newSort] = Utils.handleSort(property, data, sort, 'review', asc);
    setSort(newSort);
    setData(sortedData);
  }, [data, sort]);

  const surveyTitle = !survey
      || (<div className="SurveyTitle">{survey.label}</div>);
  const surveySelector = !survey
      || (
        <SurveySelector
          survey={survey}
          updateFunc={(newSurvey) => setRedirect({ pathname: `/review/${newSurvey.id}`, survey: newSurvey })}
        />
      );

  return redirect
    ? <Redirect to={redirect} />
    : (
      <div id="Review">
        <Container fluid>
          <Row>
            <Col>
              <Link to="/" className="ButtonLink ReturnButtonLink">
                <Button className="ReturnButton" data-testid="return-button">{D.back}</Button>
              </Link>
            </Col>
            <Col xs={6}>
              {surveyTitle}
            </Col>
            <Col>
              {surveySelector}
            </Col>
          </Row>
        </Container>
        <Card className="ViewCard">
          <Card.Title className="PageTitle">
            {D.surveyUnitsToReview}
            {isLoading ? '' : data.length}
          </Card.Title>
          {
            isLoading
              ? <Spinner className="loadingSpinner" animation="border" variant="primary" />
              : (
                <>
                  {
                    data.length > 0
                      ? (
                        <ReviewTable
                          data={data}
                          sort={sort}
                          survey={survey}
                          handleSort={handleSort}
                          validateSU={validateSU}
                          viewSU={viewSU}
                          validateUpdateComment={validateUpdateComment}
                        />
                      )
                      : <span>{D.noSuToReview}</span>
                  }
                </>
              )
          }
        </Card>
      </div>
    );
}

export default Review;
