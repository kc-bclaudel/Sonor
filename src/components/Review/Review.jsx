import React, { useState, useEffect, useCallback } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, Redirect } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import SurveySelector from '../SurveySelector/SurveySelector';
import ReviewTable from './ReviewTable';
import Utils from '../../utils/Utils';
import D from '../../i18n';

function Review({
  location, dataRetreiver, match,
}) {
  const { survey } = location;
  const { id } = match.params;
  const [data, setData] = useState([]);
  const [sort, setSort] = useState({ sortOn: null, asc: null });
  const [redirect, setRedirect] = useState(!survey && id ? '/' : null);

  const fetchData = useCallback(() => {
    let surveyId = null;
    if (survey) surveyId = survey.id;
    dataRetreiver.getDataForReview(surveyId, (res) => {
      setData(res);
      setRedirect(null);
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
          NotificationManager.error(D.reviewAlertError, D.error, 3500);
        } else {
          NotificationManager.success(`${D.reviewAlertSuccess}: ${lstSUFinalized.join(', ')}.`, D.updateSuccess, 3500);
        }
        fetchData();
      });
  }

  function handleSort(property, asc) {
    const [sortedData, newSort] = Utils.handleSort(property, data, sort, 'review', asc);
    setSort(newSort);
    setData(sortedData);
  }

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
              <Link to="/" className="ButtonLink">
                <Button className="YellowButton ReturnButton" data-testid="return-button">{D.back}</Button>
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
          <Card.Title>
            {D.surveyUnitsToReview}
            {data.length}
          </Card.Title>
          {
            data.length > 0
              ? (
                <ReviewTable
                  data={data}
                  sort={sort}
                  survey={survey}
                  handleSort={handleSort}
                  validateSU={validateSU}
                />
              )
              : <span>{D.noSuToReview}</span>
          }
        </Card>
      </div>
    );
}

export default Review;
