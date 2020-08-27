import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Col, Row } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import SurveySelector from '../SurveySelector/SurveySelector';
import SUTable from './SUTable';
import Utils from '../../utils/Utils';
import D from '../../i18n';

function ListSU({
  location, dataRetreiver,
}) {
  const { survey } = location;

  const [data, setData] = useState([]);
  const [site, setSite] = useState('');
  const [sort, setSort] = useState({ sortOn: null, asc: null });
  const [redirect, setRedirect] = useState(!survey ? '/' : null);

  useEffect(() => {
    dataRetreiver.getDataForListSU(!survey || survey.id, (res) => {
      setData(res.surveyUnits);
      setSite(res.site);
      setRedirect(null);
    });
  }, [redirect, dataRetreiver, survey]);

  function handleSort(property, asc) {
    const [sortedData, newSort] = Utils.handleSort(property, data, sort, 'listSU', asc);
    setSort(newSort);
    setData(sortedData);
  }

  return redirect
    ? <Redirect to={redirect} />
    : (
      <div id="ListSU">
        <Row>
          <Col>
            <Link to="/" className="ButtonLink">
              <Button className="YellowButton ReturnButton" data-testid="return-button">{D.back}</Button>
            </Link>
          </Col>
          <Col xs={6}>
            <div className="SurveyTitle">{survey.label}</div>
          </Col>
          <Col id="RightCoListSU">
            <SurveySelector
              survey={survey}
              updateFunc={(newSurvey) => setRedirect({ pathname: `/listSU/${newSurvey.id}`, survey: newSurvey })}
            />
          </Col>
        </Row>
        <Card className="ViewCard">
          <Card.Title>
            {D.surveyUnitsAllocatedToTheOU}
            {data.length}
          </Card.Title>
          {
            data.length > 0
              ? (
                <SUTable
                  sort={sort}
                  handleSort={handleSort}
                  data={data}
                  survey={survey}
                  site={site}
                />
              )
              : <span>{D.noListSuToDisplay}</span>
          }
          </Card>
      </div>
    );
}

export default ListSU;
