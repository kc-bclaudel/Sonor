import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PaginationNav from '../PaginationNav/PaginationNav';
//import '../MainScreen/MainScreen.css';

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

          <PaginationNav.SizeSelector
            updateFunc={(pagination) => updateInterviewersDetail(
              survey,
              data.date,
              pagination,
              data.relevantInterviewers,
            )}
          />
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
        <PaginationNav.PageSelector
          pagination={data.pagination}
          updateFunc={(pagination) => updateInterviewersDetail(
            survey,
            data.date,
            pagination,
            data.relevantInterviewers,
          )}
          numberOfItems={data.relevantInterviewers.length}
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

export default MonitoringTable;
