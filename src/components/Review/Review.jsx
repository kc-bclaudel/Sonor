import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import SortIcon from '../SortIcon/SortIcon';
import SearchField from '../SearchField/SearchField';
import SurveySelector from '../SurveySelector/SurveySelector';
import PaginationNav from '../PaginationNav/PaginationNav';
import D from '../../i18n'; 

function Review({
  survey, data, sort, handleSort, goToReview, validateSU, returnToMainScreen,
}) {
  const surveyTitle = !survey
      || (<div className="SurveyTitle">{survey.label}</div>);
  const surveySelector = !survey
      || (
        <SurveySelector
          survey={survey}
          updateFunc={(newSurvey) => goToReview(newSurvey)}
        />
      );
  return (
    <div id="Review">
      <Container fluid>
        <Row>
          <Col>
            <Button className="YellowButton ReturnButton" onClick={() => returnToMainScreen()} data-testid="return-button">{D.back}</Button>
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
          goToReview={goToReview}
        />
      </Card>
    </div>
  );
}

function displaySurveyLines({
  displayedLines, pagination, checkboxArray, toggleCheckBox,
}) {
  const lines = [];
  let oddLine = true;
  for (let i = (pagination.page - 1) * pagination.size;
    i < pagination.page * pagination.size && i < displayedLines.length;
    i += 1
  ) {
    lines.push(
      <SurveyUnitLine
        key={i}
        oddLine={oddLine}
        lineData={displayedLines[i]}
        isChecked={checkboxArray[displayedLines[i].id]}
        updateFunc={() => toggleCheckBox(displayedLines[i].id)}
      />,
    );
    oddLine = !oddLine;
  }
  return lines;
}

class ReviewTable extends React.Component {
  constructor(props) {
    super(props);
    const checkboxArray = {};
    props.data.listSU.forEach((element) => {
      checkboxArray[element.id] = false;
    });
    this.state = {
      pagination: { size: 5, page: 1 },
      checkboxArray,
      checkAll: false,
      show: false,
      displayedLines: props.data.listSU,
    };
  }

  componentDidUpdate(prevProps) {
    const { survey, data } = this.props;
    const checkboxArray = {};
    if (prevProps.survey !== survey) {
      data.listSU.forEach((element) => {
        checkboxArray[element.id] = false;
      });
      this.setState({ checkboxArray, checkAll: false });
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

  updateInterviewers(matchingLines) {
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
    const lstSUFinalized = [];
    Object.entries(checkboxArray).forEach((su) => {
      if (su[1]) {
        lstSUFinalized.push(su[0]);
      }
    });
    validateSU(survey, lstSUFinalized);
  }

  handleCheckAll(e) {
    const { checkboxArray } = this.state;
    const newCheckboxArray = { ...checkboxArray };
    Object.entries(newCheckboxArray).forEach((elm) => {
      newCheckboxArray[elm[0]] = e.target.checked;
    });
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
    const { sort, handleSort, data } = this.props;
    const {
      displayedLines, pagination, checkboxArray, checkAll, show,
    } = this.state;
    const { listSU } = data;
    const fieldsToSearch = ['campaignLabel', 'interviewer', 'id'];
    const toggleCheckBox = (i) => { this.toggleCheckBox(i); };
    function handleSortFunct(property) { return () => { handleSort(property); }; }
    return (
      <div>
        <div id="searchParametersContainer">
          <PaginationNav.SizeSelector
            updateFunc={(newPagination) => this.handlePageChange(newPagination)}
          />
          <SearchField
            data={listSU}
            searchBy={fieldsToSearch}
            updateFunc={(matchinglines) => this.updateLines(matchinglines)}
          />
        </div>
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
            {displaySurveyLines({
              displayedLines, pagination, checkboxArray, toggleCheckBox,
            })}
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
  lineData, oddLine, isChecked, updateFunc,
}) {
  const {
    campaignLabel, interviewer, id,
  } = lineData;
  const lineColor = oddLine ? 'DarkgreyLine' : 'LightGreyLine';
  return (
    <tr className={lineColor}>
      <td className="Clickable"><input key={id} type="checkbox" checked={isChecked} name={id} value={id} onChange={() => updateFunc()} /></td>
      <td onClick={() => { window.open('', '_blank'); }} className="Clickable">{campaignLabel}</td>
      <td onClick={() => { window.open('', '_blank'); }} className="Clickable">{interviewer}</td>
      <td onClick={() => { window.open('', '_blank'); }} className="Clickable">{id}</td>
    </tr>
  );
}

export default Review;
