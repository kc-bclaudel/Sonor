import React from 'react';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import displayStateHistoryTable from './DisplayStateHistoryTable';
import PaginationNav from '../PaginationNav/PaginationNav';
import SearchField from '../SearchField/SearchField';
import SortIcon from '../SortIcon/SortIcon';
import Utils from '../../utils/Utils';
import D from '../../i18n';
import './Terminated.css';

class TerminatedTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { size: 10, page: 1 },
      displayData: props.data,
      toggleStateHistory: false,
      stateData: [],
      stateId: '',
      showComment: false,
      suToModifySelected: '',
      oldComment: '',
      newComment: '',

    };
    this.queenUrl = `${window.localStorage.getItem('QUEEN_URL_FRONT_END')}`;
  }

  getMaxWidth() {
    return [
      document.getElementById('stateHistoryDate').getBoundingClientRect().width,
      document.getElementById('stateHistoryHour').getBoundingClientRect().width,
      document.getElementById('stateHistoryState').getBoundingClientRect().width,
    ];
  }

  toggleStateHistoryTable(e, newStateTitle) {
    const { dataRetreiver } = this.props;
    e.stopPropagation();
    dataRetreiver.getStatesSurvey(newStateTitle, (data) => {
      this.setState({
        toggleStateHistory: true,
        stateId: newStateTitle,
        stateData: data,
      });
    });
  }

  hideStateHistoryTable() {
    this.setState({ toggleStateHistory: false });
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

  validate() {
    const { validateUpdateComment } = this.props;
    const { suToModifySelected, newComment } = this.state;
    validateUpdateComment(suToModifySelected, newComment);
  }

  handlePageChange(pagination) {
    this.setState({ pagination });
  }

  updateLines(matchingLines) {
    const { pagination } = this.state;
    this.setState({
      pagination: { size: pagination.size, page: 1 },
      displayData: matchingLines,
    });
  }

  surveyListLine(data, survey, handleShow) {
    return (
      <tr key={data.id}>
        <td className="ColCampaign">{survey.label}</td>
        <td className="ColId" data-testid="campaign-label">{data.id}</td>
        <td className="ColInterviewer">{`${data.interviewer.interviewerLastName} ${data.interviewer.interviewerFirstName}`}</td>
        <td className="ColFinalizationDate">{`${Utils.convertToDateString(data.finalizationDate)} ${Utils.convertMsToHoursMinutes(data.finalizationDate)}`}</td>
        <td className="ColReading">{data.reading ? D.yes : D.no}</td>
        <td className="ColAction">
          <OverlayTrigger
            placement="top"
            overlay={(
              <Tooltip>
                {D.questionnaire}
              </Tooltip>
            )}
          >
            <i
              className="fa fa-calendar EditLink Clickable"
              aria-hidden="true"
              onClick={() => { window.open(`${this.queenUrl}/queen/readonly/questionnaire/${survey.id}/survey-unit/${data.id}`); }}
            />
          </OverlayTrigger>
          <span />
          <OverlayTrigger
            placement="top"
            overlay={(
              <Tooltip>
                {D.comment}
              </Tooltip>
            )}
          >
            <i
              className="fa fa-pencil EditCommentSurveyIcon Clickable"
              aria-hidden="true"
              onClick={() => handleShow()}
            />
          </OverlayTrigger>
          <span />
          <OverlayTrigger
            placement="top"
            overlay={(
              <Tooltip>
                {D.history}
              </Tooltip>
            )}
          >
            <i className="fa fa-history HistoryDisplayIcon Clickable" aria-hidden="true" onClick={(e) => { this.toggleStateHistoryTable(e, data.id); }} />
          </OverlayTrigger>
        </td>
      </tr>
    );
  }

  render() {
    const {
      pagination, displayData, stateData, toggleStateHistory, stateId, showComment,
      suToModifySelected, oldComment,
    } = this.state;
    const {
      data, survey, handleSort, sort,
    } = this.props;
    const fieldsToSearch = ['interviewerFirstName', 'interviewerLastName', 'id'];
    const handleCloseComment = () => { this.handleCloseComment(); };
    const handleShowComment = (id) => { this.handleShowComment(id); };
    function handleSortFunct(property) { return () => { handleSort(property); }; }
    return (
      <>
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
        <div id="TerminatedTableContainer">
          <Table id="SurveyList" className="CustomTable" bordered striped hover responsive size="sm">
            <thead>
              <tr>
                <th
                  id="stateHistoryHour"
                  rowSpan="2"
                  onClick={handleSortFunct('campaignLabel')}
                  className="Clickable ColCampaign"
                >
                  <SortIcon val="campaignLabel" sort={sort} />
                  {D.survey}
                </th>
                <th
                  id="stateHistoryDate"
                  data-testid="TableHeader_id_terminated"
                  rowSpan="2"
                  onClick={handleSortFunct('id')}
                  className="Clickable ColId"
                >
                  <SortIcon val="id" sort={sort} />
                  {D.identifier}
                </th>
                <th
                  id="stateHistoryState"
                  rowSpan="2"
                  onClick={handleSortFunct('interviewer_terminated')}
                  className="Clickable ColInterviewer"
                >
                  <SortIcon val="interviewer_terminated" sort={sort} />
                  {D.interviewer}
                </th>
                <th
                  rowSpan="2"
                  onClick={handleSortFunct('finalizationDate')}
                  className="Clickable ColFinalizationDate"
                >
                  <SortIcon val="finalizationDate" sort={sort} />
                  {D.finalizedDate}
                </th>
                <th
                  rowSpan="2"
                  onClick={handleSortFunct('reading')}
                  className="Clickable ColReading"
                >
                  <SortIcon val="reading" sort={sort} />
                  {D.reading}
                </th>
                <th rowSpan="2" className="ColAction">
                  {D.listSuActions}
                </th>
              </tr>
            </thead>
            <tbody>
              {displayData
                .slice(
                  (pagination.page - 1) * pagination.size,
                  Math.min(pagination.page * pagination.size, displayData.length),
                )
                .map((line) => (
                  this.surveyListLine(line, survey, () => handleShowComment(line))
                ))}
            </tbody>
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
                  data-testid="confirm-validate"
                  onClick={() => {
                    this.validate();
                    handleCloseComment();
                  }}
                >
                  {D.validate}
                </Button>
              </Modal.Footer>
            </Modal>
          </Table>
          <div className="tableOptionsWrapper">
            <PaginationNav.PageSelector
              pagination={pagination}
              updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
              numberOfItems={displayData.length}
            />
          </div>
        </div>
        {!toggleStateHistory
        || displayStateHistoryTable(
          stateData,
          stateId,
          (() => this.hideStateHistoryTable()), (() => this.getMaxWidth()),
        )}
      </>
    );
  }
}

export default TerminatedTable;
