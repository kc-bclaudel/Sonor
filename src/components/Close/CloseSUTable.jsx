import React from 'react';
import Button from 'react-bootstrap/Button';
import { Col, Row } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import SortIcon from '../SortIcon/SortIcon';
import SearchField from '../SearchField/SearchField';
import PaginationNav from '../PaginationNav/PaginationNav';
import CloseSurveyUnitLine from './CloseSurveyUnitLine';
import D from '../../i18n';

function makeTableForExport(data) {
  const header = [[
    D.survey,
    D.identifier,
    D.interviewer,
    D.ssech,
    D.department,
    D.town,
    D.state,
  ]];

  return header.concat(data.map((line) => ([
    line.campaign,
    line.id,
    `${line.interviewer.interviewerLastName} ${line.interviewer.interviewerFirstName}`,
    line.ssech,
    line.location ? line.location.substring(0, 2) : null,
    line.city,
    line.state,
  ])));
}

class CloseSUTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { size: 10, page: 1 },
      displayedLines: props.data,
      checkboxArray: props.data.reduce((acc, curr) => { acc[curr.id] = false; return acc; }, {}),
      checkAll: false,
      show: false,
      stateModified: '',
    };
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (prevProps.data !== data) {
      this.setState({ displayedLines: data });
      const newCheckboxArray = Array.isArray(data)
        ? data.reduce(
          (acc, curr) => { acc[curr.id] = false; return acc; }, {},
        )
        : [];
      this.setState({ checkboxArray: newCheckboxArray, checkAll: false });
    }
  }

  handlePageChange(pagination) {
    this.setState({ pagination });
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

  toggleCheckBox(i) {
    const { checkboxArray } = this.state;
    const newCheckboxArray = { ...checkboxArray };
    newCheckboxArray[i] = !newCheckboxArray[i];
    this.setState({
      checkboxArray: newCheckboxArray,
      checkAll: !Object.values(newCheckboxArray).some((elm) => !elm),
    });
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  isDisabled() {
    const { checkboxArray } = this.state;
    return !Object.values(checkboxArray).some((elm) => elm);
  }

  validate() {
    const { validateChangingState } = this.props;
    const { checkboxArray, stateModified } = this.state;
    const lstSUChangingState = Object.entries(checkboxArray)
      .filter((su) => (su[1]))
      .map((su) => (su[0]));
    validateChangingState(lstSUChangingState, stateModified);
  }

  handleExport() {
    const { data } = this.props;
    const fileLabel = 'UE_à_clore';
    const title = `${fileLabel}_${new Date().toLocaleDateString().replace(/\//g, '')}.csv`.replace(/ /g, '_');
    const table = makeTableForExport(data);
    const csvContent = `data:text/csv;charset=utf-8,\ufeff${table.map((e) => e.join(';')).join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', title);
    document.body.appendChild(link);
    link.click();
    link.remove();
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

  render() {
    const {
      data, sort, handleSort, isLoading,
    } = this.props;
    const fieldsToSearch = ['campaign', 'id', 'city', 'state', 'interviewer'];
    const {
      pagination, displayedLines, checkboxArray, checkAll, show, stateModified,
    } = this.state;
    const toggleCheckBox = (i) => { this.toggleCheckBox(i); };
    function handleSortFunct(property) { return () => { handleSort(property); }; }
    return (
      <Card className="ViewCard">
        <Card.Title className="PageTitle">
          {D.unprocessedSurveyUnitsToClose}
          {isLoading ? '' : data.length}
          {!data.length
            || (
              <Button
                className="ExportButton"
                data-testid="export-button"
                onClick={() => this.handleExport()}
              >
                Export
              </Button>
            )}
        </Card.Title>
        {
          isLoading
            ? <Spinner className="loadingSpinner" animation="border" variant="primary" />
            : (
              <>
                {
                  data.length > 0
                    ? (
                      <div>
                        <Row>
                          <Col xs="12" className="text-right">
                            <SearchField
                              data={data}
                              searchBy={fieldsToSearch}
                              updateFunc={(matchinglines) => this.updateLines(matchinglines)}
                            />
                          </Col>
                          <Col xs="6">
                            <PaginationNav.SizeSelector
                              updateFunc={(newPagination) => this.handlePageChange(newPagination)}
                            />
                          </Col>
                          <Col xs="6" className="text-right">
                            <span>
                              {D.result}
                              {displayedLines.length}
                              /
                              {data.length}
                              &nbsp;
                              {D.units}
                            </span>
                          </Col>
                        </Row>
                        <Table id="CloseSUTable" className="CustomTable" bordered striped hover responsive size="sm">
                          <thead>
                            <tr>
                              <th className="ColCheckbox">
                                <input type="checkbox" name="checkAll" checked={checkAll} onChange={(e) => this.handleCheckAll(e)} />
                              </th>
                              <th onClick={handleSortFunct('campaign')} className="Clickable ColCampaign">
                                {D.survey}
                                <SortIcon val="campaign" sort={sort} />
                              </th>
                              <th onClick={handleSortFunct('id')} className="Clickable ColId">
                                {D.identifier}
                                <SortIcon val="id" sort={sort} />
                              </th>
                              <th
                                data-testid="TableHeader_interviewer_name"
                                onClick={handleSortFunct('interviewer_closable')}
                                className="ColInterviewer"
                              >
                                {D.interviewer}
                                <SortIcon val="interviewer_closable" sort={sort} />
                              </th>
                              <th onClick={handleSortFunct('ssech')} className="Clickable ColSsech">
                                {D.ssech}
                                <SortIcon val="ssech" sort={sort} />
                              </th>
                              <th onClick={handleSortFunct('contact_outcome')} className="Clickable ColLocation">
                                {D.contactOutcome}
                                <SortIcon val="contact_outcome" sort={sort} />
                              </th>
                              <th onClick={handleSortFunct('questionnaire_state')} className="Clickable ColCity">
                                {D.questionnaireState}
                                <SortIcon val="questionnaire_state" sort={sort} />
                              </th>
                              <th onClick={handleSortFunct('state')} className="Clickable ColState">
                                {D.state}
                                <SortIcon val="state" sort={sort} />
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
                                <CloseSurveyUnitLine
                                  key={line.id}
                                  lineData={line}
                                  isChecked={checkboxArray[line.id]}
                                  updateFunc={() => toggleCheckBox(line.id)}
                                />
                              ))}
                          </tbody>
                        </Table>
                        <div className="tableOptionsWrapper">
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={this.isDisabled()}
                            data-testid="validate-su"
                            onClick={() => this.handleShow()}
                          >
                            {D.close2}
                          </button>
                          <PaginationNav.PageSelector
                            pagination={pagination}
                            updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
                            numberOfItems={displayedLines.length}
                          />
                        </div>
                        <Modal show={show} onHide={() => this.handleClose()}>
                          <Modal.Header closeButton>
                            <Modal.Title>{D.modaleModifiedText}</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Form.Group as={Col} controlId="formGridState">
                              <Form.Label>{D.state}</Form.Label>
                              <Form.Control
                                data-testid="closing-cause-select"
                                as="select"
                                custom
                                placeholder={D.modaleModifiedText}
                                defaultValue={-1}
                                onChange={(e) => this.setState({ stateModified: e.target.value })}
                              >
                                <option disabled value={-1} key={-1}>{D.modaleModifiedText}</option>
                                <option>{D.NPA}</option>
                                <option>{D.NPI}</option>
                              </Form.Control>
                            </Form.Group>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              variant="secondary"
                              data-testid="close-modal"
                              onClick={() => this.handleClose()}
                            >
                              {D.cancel}
                            </Button>
                            <Button
                              variant="primary"
                              disabled={!stateModified || stateModified === -1}
                              data-testid="confirm-validate"
                              onClick={() => {
                                this.validate();
                                this.handleClose();
                              }}
                            >
                              {D.validate}
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </div>
                    )
                    : <span>{D.noListSuToDisplay}</span>
                }
              </>
            )}
      </Card>
    );
  }
}

export default CloseSUTable;
