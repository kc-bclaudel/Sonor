import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import SortIcon from '../SortIcon/SortIcon';
import SearchField from '../SearchField/SearchField';
import SurveyUnitLine from './SurveyUnitLine';
import PaginationNav from '../PaginationNav/PaginationNav';
import D from '../../i18n';

class ReviewTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { size: 10, page: 1 },
      checkboxArray: props.data.reduce((acc, curr) => { acc[curr.id] = false; return acc; }, {}),
      checkAll: false,
      show: false,
      displayedLines: props.data,
      showComment: false,
      suToModifySelected: '',
      oldComment: '',
      newComment: '',
    };
  }

  componentDidUpdate(prevProps) {
    const { survey, data } = this.props;
    if (prevProps.survey !== survey) {
      const newCheckboxArray = data.reduce(
        (acc, curr) => { acc[curr.id] = false; return acc; },
        {},
      );
      this.setState({ checkboxArray: newCheckboxArray, checkAll: false });
    }
  }

  handlePageChange(pagination) {
    this.setState({ pagination });
  }

  updateLines(matchingLines) {
    const { pagination, checkboxArray } = this.state;
    const newCheckboxArray = Object.keys(checkboxArray).reduce(
      (acc, curr) => { acc[curr] = false; return acc; }, {},
    );
    this.setState({
      checkboxArray: newCheckboxArray,
      checkAll: false,
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

  handleCloseComment() {
    this.setState({ showComment: false });
  }

  handleShowComment(line) {
    this.setState({ showComment: true, suToModifySelected: line.id });
    if (line.comments != null) {
      let comToSet = '';
      const comment = line.comments.find((c) => c.type === 'MANAGEMENT');
      if (comment) {
        comToSet = comment.value;
      }
      this.setState({ oldComment: comToSet });
    } else {
      this.setState({ oldComment: '' });
    }
  }

  view(line) {
    const { viewSU } = this.props;
    if (!line.viewed) {
      viewSU(line.id);
    }
  }

  validateComment() {
    const { validateUpdateComment } = this.props;
    const { suToModifySelected, newComment } = this.state;
    validateUpdateComment(suToModifySelected, newComment);
  }

  validateSU() {
    const { validateSU } = this.props;
    const { checkboxArray } = this.state;
    const ids = Object.entries(checkboxArray)
      .filter((su) => (su[1]))
      .map((su) => (su[0]));
    validateSU(ids);
  }

  handleCheckAll() {
    const { checkboxArray, checkAll } = this.state;
    const newCheckboxArray = Object.keys(checkboxArray).reduce(
      (acc, curr) => { acc[curr] = !checkAll; return acc; }, {},
    );
    this.setState({
      checkboxArray: newCheckboxArray,
      checkAll: !checkAll,
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
      displayedLines, pagination, checkboxArray, checkAll, show, showComment,
      suToModifySelected, oldComment,
    } = this.state;
    const fieldsToSearch = ['campaignLabel', 'interviewer', 'id'];
    const toggleCheckBox = (i) => { this.toggleCheckBox(i); };
    const view = (line) => { this.view(line); };
    const handleCloseComment = () => { this.handleCloseComment(); };
    const handleShowComment = (line) => { this.handleShowComment(line); };
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
              <th className="CheckboxCol" onClick={() => this.handleCheckAll()}>
                <input type="checkbox" name="checkAll" readOnly checked={checkAll} />
              </th>
              <th onClick={handleSortFunct('campaignLabel')} className="Clickable ColCampaign">
                <SortIcon val="campaignLabel" sort={sort} />
                {D.survey}
              </th>
              <th
                onClick={handleSortFunct('id')}
                className="Clickable ColId"
              >
                <SortIcon val="id" sort={sort} />
                {D.identifier}
              </th>
              <th
                onClick={handleSortFunct('interviewer')}
                data-testid="TableHeader_interviewer_name_review"
                className="Clickable ColInterviewer"
              >
                <SortIcon val="interviewer" sort={sort} />
                {D.interviewer}
              </th>
              <th className="ColAction">
                {D.listSuActions}
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
                  view={() => view(line)}
                  updateFunc={() => toggleCheckBox(line.id)}
                  handleShow={() => handleShowComment(line)}
                />
              ))}
              <Modal show={showComment} onHide={() => handleCloseComment()}>
                <Modal.Header closeButton>
                  <Modal.Title>{D.modifiedCommentSu + suToModifySelected}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>{D.modifiedCommentSuLastComment}</Form.Label>
                    <Form.Control
                      type="text"
                      as="textarea"
                      defaultValue={oldComment}
                      onChange={(e) => this.setState({ newComment: e.target.value })}
                    />
                    <Form.Text id="passwordHelpBlock" muted>
                      {D.modifyCommentSuHelpText}
                    </Form.Text>
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    data-testid="close-modal"
                    onClick={() => handleCloseComment()}
                  >
                    {D.cancel}
                  </Button>
                  <Button
                    variant="primary"
                    data-testid="confirm-update-comment"
                    onClick={() => {
                      this.validateComment();
                      handleCloseComment();
                    }}
                  >
                    {D.validate}
                  </Button>
                </Modal.Footer>
              </Modal>
          </tbody>
        </Table>
        <div className="tableOptionsWrapper">
          <button
            id="btnValider"
            type="button"
            className="btn btn-primary"
            disabled={this.isDisabled()}
            data-testid="validate-su"
            onClick={() => this.handleShow()}
          >
            {D.validate}
          </button>
          <PaginationNav.PageSelector
            pagination={pagination}
            updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
            numberOfItems={displayedLines.length}
          />
        </div>

        <Modal show={show} onHide={() => this.handleClose()}>
          <Modal.Header closeButton />
          <Modal.Body>
            {D.reviewValidatePopupBodyPart1}
            {Object.values(checkboxArray).filter((elm) => elm).length}
            {D.reviewValidatePopupBodyPart2}
          </Modal.Body>
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
              onClick={() => { this.validateSU(); this.handleClose(); }}
            >
              {D.popupConfirm}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ReviewTable;
