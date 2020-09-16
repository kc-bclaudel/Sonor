import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import SortIcon from '../SortIcon/SortIcon';
import SearchField from '../SearchField/SearchField';
import SurveyUnitLine from './SurveyUnitLine';
import PaginationNav from '../PaginationNav/PaginationNav';
import D from '../../i18n';

class ReviewTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { size: 5, page: 1 },
      checkboxArray: props.data.reduce((acc, curr) => { acc[curr.id] = false; return acc; }, {}),
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
    const { validateSU } = this.props;
    const { checkboxArray } = this.state;

    const lstSUFinalized = Object.entries(checkboxArray)
      .filter((su) => (su[1]))
      .map((su) => (su[0]));

    validateSU(lstSUFinalized);
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
              <th
                onClick={handleSortFunct('interviewer')}
                data-testid="TableHeader_interviewer_name_review"
              >
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
        <button
          type="button"
          className="btn btn-primary"
          disabled={this.isDisabled()}
          data-testid="validate-su"
          onClick={() => this.handleShow()}
        >
          {D.validate}
        </button>

        <Modal show={show} onHide={() => this.handleClose()}>
          <Modal.Header closeButton>
            <Modal.Title>{D.reviewValidatePopupTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{D.reviewValidatePopupBody}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              data-testid="close-modal"
              onClick={() => this.handleClose()}
            >
              {D.close}
            </Button>
            <Button
              variant="primary"
              data-testid="confirm-validate"
              onClick={() => { this.validate(); this.handleClose(); }}
            >
              {D.validate}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ReviewTable;
