import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';

function getMatchingInterviewers(interviewers, str) {
  const matchingInterviewers = [];
  const s = str.toLowerCase();
  interviewers.forEach((interviewer) => {
    if ((`${interviewer.interviewerFirstName} ${interviewer.interviewerLastName}`).toLowerCase().includes(s)) {
      matchingInterviewers.push(interviewer);
    }
  });
  return matchingInterviewers;
}

function MonitoringTable({
  survey, data, returnToMainScreen, updateInterviewersDetail,
}) {
  return (
    <div id="MonitoringTable">
      <Button className="YellowButton ReturnButton" onClick={() => returnToMainScreen()}>Retour</Button>
      <div className="SurveyTitle">{survey}</div>
      <Card className="ViewCard">
        <Card.Title>
          <div className="DateDisplay">Avancement selon l&apos;état des unités enquêtées en date du: </div>
          <input
            id="datePicker"
            className="DateDisplay"
            type="date"
            value={data.date}
            onChange={(e) => updateInterviewersDetail(
              survey,
              e.target.value,
              data.pagination,
              data.relevantInterviewers,
            )}
          />
        </Card.Title>
        <div id="searchParametersContainer">
          <span>Afficher </span>
          <span>
            <Form id="pageSizeSelector">
              <Form.Group controlId="exampleForm.SelectCustom">
                <Form.Control
                  as="select"
                  size="sm"
                  custom
                  onChange={(e) => updateInterviewersDetail(
                    survey,
                    data.date,
                    { size: e.target.value, page: 1 },
                    data.relevantInterviewers,
                  )}
                >
                  <option>5</option>
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </Form.Control>
              </Form.Group>
            </Form>
            <span> éléments</span>
          </span>
          <span id="searchField">
            <span>Rechercher: </span>
            <input
              type="text"
              onChange={(e) => updateInterviewersDetail(
                survey,
                data.date,
                { size: data.pagination.size, page: 1 },
                getMatchingInterviewers(data.interviewers, e.target.value),
                true,
              )}
            />
          </span>
        </div>
        <FollowUpTable data={data} />
        <PaginationNav
          survey={survey}
          data={data}
          updateInterviewersDetail={updateInterviewersDetail}
        />
      </Card>
    </div>
  );
}

function displayFollowUpTableLines(interviewersDetail) {
  const lines = [];
  let key = 0;
  let oddLine = true;
  interviewersDetail.forEach((lineData) => {
    lines.push(<FollowUpTableLine key={key} oddLine={oddLine} data={lineData} />);
    oddLine = !oddLine;
    key += 1;
  });
  return lines;
}

function FollowUpTable({ data }) {
  return (
    <Table id="FollowUpTable" className="CustomTable" bordered striped hover responsive size="sm">
      <thead>
        <tr>
          <th rowSpan="2">Enquêteur</th>
          <th rowSpan="2" className="ColumnSpacing" />
          <th rowSpan="2" className="YellowHeader">Taux d&apos;avancement</th>
          <th rowSpan="2" className="ColumnSpacing" />
          <th colSpan="6">Nombre d&apos;unités enquêtées</th>
          <th rowSpan="2" className="ColumnSpacing" />
          <th colSpan="4" className="YellowHeader">Unités enquêtées en cours de collecte</th>
        </tr>
        <tr>
          <th>Confiées</th>
          <th>Non commencées</th>
          <th>En cours</th>
          <th>En attente de validation enquêteur</th>
          <th>Valiées enquêteur</th>
          <th>Validées DEM</th>
          <th className="YellowHeader">En préparation</th>
          <th className="YellowHeader">Au moins un contact</th>
          <th className="YellowHeader">RDV pris</th>
          <th className="YellowHeader">Questionnaire démarré</th>
        </tr>
      </thead>
      <tbody>
        {displayFollowUpTableLines(data.interviewersDetail)}
      </tbody>
      <tfoot>
        <tr>
          <th>Total DEM</th>
          <th className="ColumnSpacing" />
          <th className="YellowHeader">
            {(Math.round(data.total.dem.completionRate * 1000) / 1000) * 100}
            %
          </th>
          <th className="ColumnSpacing" />
          <th>{data.total.dem.total}</th>
          <th>{data.total.dem.notStarted}</th>
          <th>{data.total.dem.onGoing}</th>
          <th>{data.total.dem.waitingForIntValidation}</th>
          <th>{data.total.dem.intValidated}</th>
          <th>{data.total.dem.demValidated}</th>
          <th className="ColumnSpacing" />
          <th className="YellowHeader">{data.total.dem.preparingContact}</th>
          <th className="YellowHeader">{data.total.dem.atLeastOneContact}</th>
          <th className="YellowHeader">{data.total.dem.appointmentTaken}</th>
          <th className="YellowHeader">{data.total.dem.interviewStarted}</th>
        </tr>
        <tr>
          <th>Total France</th>
          <th className="ColumnSpacing" />
          <th className="YellowHeader">
            {(Math.round(data.total.france.completionRate * 1000) / 1000) * 100}
            %
          </th>
          <th className="ColumnSpacing" />
          <th>{data.total.france.total}</th>
          <th>{data.total.france.notStarted}</th>
          <th>{data.total.france.onGoing}</th>
          <th>{data.total.france.waitingForIntValidation}</th>
          <th>{data.total.france.intValidated}</th>
          <th>{data.total.france.demValidated}</th>
          <th className="ColumnSpacing" />
          <th className="YellowHeader">{data.total.france.preparingContact}</th>
          <th className="YellowHeader">{data.total.france.atLeastOneContact}</th>
          <th className="YellowHeader">{data.total.france.appointmentTaken}</th>
          <th className="YellowHeader">{data.total.france.interviewStarted}</th>
        </tr>
      </tfoot>
    </Table>
  );
}

function FollowUpTableLine({ data, oddLine }) {
  const {
    interviewer,
    completionRate,
    total,
    notStarted,
    onGoing,
    waitingForIntValidation,
    intValidated,
    demValidated,
    preparingContact,
    atLeastOneContact,
    appointmentTaken,
    interviewStarted,
  } = data;
  const lineColor = oddLine ? 'DarkgreyLine' : 'LightGreyLine';
  return (
    <tr className={lineColor}>
      <td>{interviewer}</td>
      <td className="ColumnSpacing" />
      <td>
        {(Math.round(completionRate * 1000) / 1000) * 100}
        %
      </td>
      <td className="ColumnSpacing" />
      <td>{total}</td>
      <td>{notStarted}</td>
      <td>{onGoing}</td>
      <td>{waitingForIntValidation}</td>
      <td>{intValidated}</td>
      <td>{demValidated}</td>
      <td className="ColumnSpacing" />
      <td>{preparingContact}</td>
      <td>{atLeastOneContact}</td>
      <td>{appointmentTaken}</td>
      <td>{interviewStarted}</td>
    </tr>
  );
}

function makePaginationItem(pageNumber, activePage, survey, data, updateFunc) {
  return (
    <Pagination.Item
      key={pageNumber}
      active={activePage === pageNumber}
      onClick={() => updateFunc(survey,
        data.date,
        { size: data.pagination.size, page: pageNumber },
        data.relevantInterviewers)}
    >
      {pageNumber}
    </Pagination.Item>
  );
}

function PaginationNav({ survey, data, updateInterviewersDetail }) {
  const update = updateInterviewersDetail;
  const numberOfPages = Math.floor(data.relevantInterviewers.length / data.pagination.size);
  const active = data.pagination.page;
  const items = [];

  if (numberOfPages < 8) {
    for (let number = 1; number <= 1 + numberOfPages; number += 1) {
      items.push(makePaginationItem(number, active, survey, data, update));
    }
  } else {
    const activeForCalc = Math.min(Math.max(active, 4), numberOfPages - 3);
    let numbers = [1, activeForCalc - 1, activeForCalc, activeForCalc + 1, numberOfPages];
    numbers = numbers.slice(0, numbers.indexOf(numberOfPages) + 1);
    numbers = numbers.slice(numbers.lastIndexOf(1));
    numbers.forEach((number) => {
      if (number === numberOfPages) {
        if (activeForCalc < numberOfPages - 3) {
          items.push(
            <Pagination.Item key={-1} active={false}>...</Pagination.Item>,
          );
        } else {
          items.push(makePaginationItem(numberOfPages - 1, active, survey, data, update));
        }
      }
      items.push(makePaginationItem(number, active, survey, data, update));

      if (number === 1) {
        if (activeForCalc > 4) {
          items.push(
            <Pagination.Item key={2} active={false}>...</Pagination.Item>,
          );
        } else {
          items.push(makePaginationItem(2, active, survey, data, update));
        }
      }
    });
  }

  return (
    <div className="paginationNavWrapper">
      <Pagination size="sm" className="paginationNav">{items}</Pagination>
    </div>
  );
}

export default MonitoringTable;
