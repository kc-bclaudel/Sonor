import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { Link, Redirect } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import SortIcon from '../SortIcon/SortIcon';
import SearchField from '../SearchField/SearchField';
import SurveySelector from '../SurveySelector/SurveySelector';
import PaginationNav from '../PaginationNav/PaginationNav';
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

  function fetchData() {
    let surveyId = null;
    if (survey) surveyId = survey.id;
    dataRetreiver.getDataForReview(surveyId, (res) => {
      setData(res);
      setRedirect(null);
    });
  }

  useEffect(() => {
    fetchData();
  }, [redirect]);

  function validateSU(lstSUFinalized) {
    dataRetreiver.finalizeSurveyUnits(lstSUFinalized)
      .then((res) => {
        if (res.status === 200 || res.status === 201 || res.status === 204) {
          NotificationManager.success(`${D.reviewAlertSuccess}: ${lstSUFinalized.join(', ')}.`, D.updateSuccess, 3500);
        } else {
          NotificationManager.error(D.reviewAlertError, D.error, 3500);
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
          <ReviewTable
            data={data}
            sort={sort}
            survey={survey}
            handleSort={handleSort}
            validateSU={validateSU}
          />
        </Card>
      </div>
    );
}

class ReviewTable extends React.Component {
  constructor(props) {
    super(props);
    const checkboxArray = props.data.reduce(
      (acc, curr) => { acc[curr.id] = false; return acc; }, {},
    );
    this.state = {
      pagination: { size: 5, page: 1 },
      checkboxArray,
      checkAll: false,
      show: false,
      displayedLines: props.data,
    };
  }

  componentDidUpdate(prevProps) {
    const { survey, data } = this.props;
    if (prevProps.survey !== survey || prevProps.data !== data) {
      const checkboxArray = data.reduce((acc, curr) => { acc[curr.id] = false; return acc; }, {});
      this.setState({ checkboxArray, checkAll: false, displayedLines: data });
    }
  }

  handlePageChange(pagination) {
    this.setState({ pagination });
  }

  updateLines(matchingLines) {
    const { pagination } = this.state;
    this.setState({
      pagination: { size: pagination.size, page: 1 },
      displayedLines: matchingLines,
    });
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  validate() {
    const { survey, validateSU } = this.props;
    const { checkboxArray } = this.state;

    const lstSUFinalized = Object.entries(checkboxArray)
      .filter((su) => (su[1]))
      .map((su) => (su[0]));

    validateSU(survey, lstSUFinalized);
  }

  handleCheckAll(e) {
    const { checkboxArray } = this.state;
    const newCheckboxArray = Object.keys(checkboxArray).reduce(
      (acc, curr) => { acc[curr] = e.target.checked; return acc; }, {},
    );
    this.setState({
      checkboxArray: newCheckboxArray,
      checkAll: e.target.checked,
    });
  }

  isDisabled() {
    const { checkboxArray } = this.state;
    return !Object.values(checkboxArray).some((elm) => elm);
  }

  toggleCheckBox(i) {
    const { checkboxArray } = this.state;
    const newCheckboxArray = { ...checkboxArray };
    newCheckboxArray[i] = !newCheckboxArray[i];
    this.setState({
      checkboxArray: newCheckboxArray,
      checkAll: !Object.values(newCheckboxArray).some((elm) => !elm),
    });
  }

  render() {
    const { sort, data, handleSort } = this.props;
    const {
      displayedLines, pagination, checkboxArray, checkAll, show,
    } = this.state;
    const fieldsToSearch = ['campaignLabel', 'interviewer', 'id'];
    const toggleCheckBox = (i) => { this.toggleCheckBox(i); };
    function handleSortFunct(property) { return () => { handleSort(property); }; }
    return (
      <div>
        <Row>
          <Col xs="6">
            <PaginationNav.SizeSelector
              updateFunc={(newPagination) => this.handlePageChange(newPagination)}
            />
          </Col>
          <Col xs="6" className="text-right">
            <SearchField
              data={data}
              searchBy={fieldsToSearch}
              updateFunc={(matchinglines) => this.updateLines(matchinglines)}
            />
          </Col>
        </Row>
        <Table id="SUTable" className="CustomTable" bordered striped hover responsive size="sm">
          <thead>
            <tr>
              <th><input type="checkbox" name="checkAll" checked={checkAll} onChange={(e) => this.handleCheckAll(e)} /></th>
              <th onClick={handleSortFunct('campaignLabel')}>
                <SortIcon val="campaignLabel" sort={sort} />
                {D.survey}
              </th>
              <th onClick={handleSortFunct('interviewer')}>
                <SortIcon val="interviewer" sort={sort} />
                {D.interviewer}
              </th>
              <th>
                {D.identifier}
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedLines
              .slice(
                (pagination.page - 1) * pagination.size,
                Math.min(pagination.page * pagination.size, displayedLines.length),
              )
              .map((line) => (
                <SurveyUnitLine
                  key={line.id}
                  lineData={line}
                  isChecked={checkboxArray[line.id]}
                  updateFunc={() => toggleCheckBox(line.id)}
                />
              ))}
          </tbody>
        </Table>
        <div className="tableOptionsWrapper">
          <PaginationNav.PageSelector
            pagination={pagination}
            updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
            numberOfItems={displayedLines.length}
          />
        </div>
        <button type="button" className="btn btn-primary" disabled={this.isDisabled()} onClick={() => this.handleShow()}>
          {D.validate}
        </button>

        <Modal show={show} onHide={() => this.handleClose()}>
          <Modal.Header closeButton>
            <Modal.Title>{D.reviewValidatePopupTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{D.reviewValidatePopupBody}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleClose()}>
              {D.close}
            </Button>
            <Button variant="primary" onClick={() => { this.validate(); this.handleClose(); }}>
              {D.validate}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

function SurveyUnitLine({
  lineData, isChecked, updateFunc,
}) {
  const {
    campaignLabel, interviewer, id,
  } = lineData;
  return (
    <tr>
      <td className="Clickable"><input key={id} type="checkbox" checked={isChecked} name={id} value={id} onChange={() => updateFunc()} /></td>
      <td onClick={() => { window.open('', '_blank'); }} className="Clickable">{campaignLabel}</td>
      <td onClick={() => { window.open('', '_blank'); }} className="Clickable">{interviewer}</td>
      <td onClick={() => { window.open('', '_blank'); }} className="Clickable">{id}</td>
    </tr>
  );
}

export default Review;
