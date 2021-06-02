import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SortIcon from '../SortIcon/SortIcon';
import PaginationNav from '../PaginationNav/PaginationNav';
import SearchField from '../SearchField/SearchField';
import InterviewerLine from './InterviewerLine';
import D from '../../i18n';

class SurveyUnits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { size: 10, page: 1 },
      displayedInterviewers: props.data.interviewers,
    };
  }

  componentDidUpdate(prevProps) {
    const { survey, data } = this.props;
    if (prevProps.survey !== survey
      || prevProps.data.interviewers.length !== data.interviewers.length) {
      this.setState({ displayedInterviewers: data.interviewers });
    }
  }

  handlePageChange(pagination) {
    this.setState({ pagination });
  }

  updateInterviewers(matchingInterviewers) {
    const { pagination } = this.state;
    this.setState({
      pagination: { size: pagination.size, page: 1 },
      displayedInterviewers: matchingInterviewers,
    });
  }

  handleExport() {
    const { data, survey } = this.props;
    const fileLabel = `${data.site}_${survey.label}_Repartition enqueteurs`;

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

  render() {
    const {
      data, sort, handleSortfunc, isLoading
    } = this.props;
    const {
      abandoned, notAttributed, total, interviewers,
    } = data;
    const { pagination, displayedInterviewers } = this.state;
    const fieldsToSearch = ['interviewerFirstName', 'interviewerLastName'];
    function handleSort(property) { return () => { handleSortfunc(property); }; }
    return (
      <Card className="ViewCard">
        <div className="Title">
          <span>{D.interviewers}</span>
          {isLoading || (
            <Button
              className="ExportButton"
              onClick={() => this.handleExport()}
            >
              Export
            </Button>
          )}
        </div>
        {
          isLoading
            ? <Spinner className="loadingSpinner" animation="border" variant="primary" />
            : (
              <>
                {
                  interviewers.length > 0 ? (
                    <>
                      <Row>
                        <Col xs="6">
                          <PaginationNav.SizeSelector
                            updateFunc={(newPagination) => this.handlePageChange(newPagination)}
                          />
                        </Col>
                        <Col xs="6" className="text-right">
                          <SearchField
                            data={interviewers}
                            searchBy={fieldsToSearch}
                            updateFunc={(a) => this.updateInterviewers(a)}
                          />
                        </Col>
                      </Row>
                      <Table className="CustomTable" bordered striped hover responsive size="sm">
                        <tbody>
                          <tr>
                            <th
                              data-testid="TableHeader_interviewer_name_portal"
                              onClick={handleSort('CPinterviewer')}
                              className="Clickable ColInterviewerName"
                            >
                              <SortIcon val="CPinterviewer" sort={sort} />
                              {D.interviewer}
                            </th>
                            <th onClick={handleSort('CPidep')} className="Clickable ColIdep">
                              <SortIcon val="CPidep" sort={sort} />
                              {D.idep}
                            </th>
                            <th onClick={handleSort('CPue')} className="Clickable ColUeNb">
                              <SortIcon val="CPue" sort={sort} />
                              {D.SU}
                            </th>
                          </tr>
                          {displayedInterviewers
                            .slice(
                              (pagination.page - 1) * pagination.size,
                              Math.min(
                                pagination.page * pagination.size,
                                displayedInterviewers.length,
                              ),
                            )
                            .map((line) => (<InterviewerLine key={line.id} interviewer={line} />))}
                          <tr>
                            <th>{D.unassigned}</th>
                            <th />
                            <th>{notAttributed.count}</th>
                          </tr>
                          <tr>
                            <th>{D.abandoned}</th>
                            <th />
                            <th>{abandoned.count}</th>
                          </tr>
                          <tr>
                            <th>{D.totalDEM}</th>
                            <th />
                            <th>{total.total}</th>
                          </tr>
                        </tbody>
                      </Table>
                      <div className="tableOptionsWrapper">
                        <PaginationNav.PageSelector
                          pagination={pagination}
                          updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
                          numberOfItems={displayedInterviewers.length}
                        />
                      </div>
                    </>
                  )
                    : <span>{D.noInterviewers}</span>
                }
              </>
            )
        }
      </Card>

    );
  }
}

function makeTableForExport(data) {
  const {
    abandoned, notAttributed, total, interviewers,
  } = data;

  const header = [[
    D.interviewer,
    D.idep,
    D.SU,
  ]];

  const footer = [
    [
      D.unassigned,
      ' ',
      notAttributed.count,
    ],
    [
      D.abandoned,
      ' ',
      abandoned.count,
    ],
    [
      D.totalDEM,
      ' ',
      total.total,
    ],
  ];

  return header.concat(
    interviewers.map((line) => ([
      `${line.interviewerLastName} ${line.interviewerFirstName}`,
      line.id,
      line.surveyUnitCount,
    ])),
    footer,
  );
}

export default SurveyUnits;
