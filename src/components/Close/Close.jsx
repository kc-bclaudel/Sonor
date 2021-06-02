import React, { useState, useEffect, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import CloseSUTable from './CloseSUTable';
import Utils from '../../utils/Utils';
import D from '../../i18n';
import './Close.css';

function Close({
  location, dataRetreiver,
}) {
  const { survey } = location;

  const [data, setData] = useState([]);
  const [site, setSite] = useState('');
  const [sort, setSort] = useState({ sortOn: null, asc: null });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    dataRetreiver.getDataForClosePage((res) => {
      setData(res);
      setSite(res.site);
      setIsLoading(false);
    });
  }, [dataRetreiver]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = useCallback((property, asc) => {
    const [sortedData, newSort] = Utils.handleSort(property, data, sort, 'listSU', asc);
    setSort(newSort);
    setData(sortedData);
  }, [data, sort]);

  function validateChangingState(lstSUChangingState, closingCause) {
    let cc;
    if (closingCause === D.NPA) {
      cc = 'NPA';
    } else if (closingCause === D.NPI) {
      cc = 'NPI';
    }
    dataRetreiver.closeSurveyUnits(lstSUChangingState, cc)
      .then((response) => {
        if (response.some(
          (res) => !(res.status === 200 || res.status === 201 || res.status === 204),
        )) {
          NotificationManager.error(`${D.changingStateAlertError}: ${lstSUChangingState
            .filter((x, index) => !(response[index].status === 200 || response[index].status === 201 || response[index].status === 204)).join(', ')}.`, D.error, 3500);
        } else {
          NotificationManager.success(`${D.changingStateAlertSuccess}: ${lstSUChangingState.join(', ')}.`, D.updateSuccess, 3500);
        }
        fetchData();
      });
  }

  useEffect(() => {
    if (sort.sortOn === null) {
      handleSort('id', true);
    }
  }, [data, handleSort, sort.sortOn]);

  return (
    <div id="ListSU">
      <Row>
        <Col>
          <Link to="/" className="ButtonLink ReturnButtonLink">
            <Button className="ReturnButton" data-testid="return-button">{D.back}</Button>
          </Link>
        </Col>

      </Row>
      <CloseSUTable
        sort={sort}
        handleSort={handleSort}
        data={data}
        survey={survey}
        site={site}
        isLoading={isLoading}
        validateChangingState={
          (lstSUChangingState,
            stateModified) => validateChangingState(lstSUChangingState, stateModified)
        }
      />
    </div>
  );
}

export default Close;
