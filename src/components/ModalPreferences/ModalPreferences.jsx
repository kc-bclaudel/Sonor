import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import D from '../../i18n';

function displaySurveys(preferences, toggleCheckbox) {
  const lines = [];
  Object.keys(preferences).forEach((key) => {
    lines.push(
      <tr className="PreferenceRow" key={key}>
        <td className="PreferenceCheckbox">
          <input
            className="Clickable"
            type="checkbox"
            checked={preferences[key].preference}
            onChange={() => toggleCheckbox(key)}
          />
        </td>
        <td>{preferences[key].label}</td>
      </tr>,
    );
  });
  return (
    <table>
      <tbody>
        {lines}
      </tbody>
    </table>
  );
}

class ModalPreferences extends React.Component {
  constructor(props) {
    super(props);
    const selectedPreferences = {};
    Object.keys(props.preferences).forEach((id) => {
      const obj = {};
      Object.assign(obj, props.preferences[id]);
      selectedPreferences[id] = obj;
    });
    this.state = { selectedPreferences, prefsChanged: false };
  }

  validateNewPreferences() {
    const { selectedPreferences } = this.state;
    const { updatePreferences } = this.props;
    const dataToSend = [];
    Object.keys(selectedPreferences).forEach((id) => {
      if (updatePreferences[id].preference) {
        dataToSend.push(id);
      }
    });
    updatePreferences(dataToSend);
  }

  updatePreferencesFromProps() {
    const { preferences } = this.props;
    const selectedPreferences = {};
    Object.keys(preferences).forEach((id) => {
      const obj = {};
      Object.assign(obj, preferences[id]);
      selectedPreferences[id] = obj;
    });
    this.setState({ selectedPreferences, prefsChanged: false });
  }

  toggleCheckbox(id) {
    const { selectedPreferences } = this.state;
    const { preferences } = this.props;
    const newPreferences = {};
    Object.assign(newPreferences, selectedPreferences);
    newPreferences[id].preference = !newPreferences[id].preference;

    const prefsChanged = Object.keys(selectedPreferences).some(
      (key) => preferences[key].preference !== newPreferences[key].preference,
    );
    this.setState({ selectedPreferences: newPreferences, prefsChanged });
  }

  render() {
    const { showPreferences, hidePreferences } = this.props;
    const { selectedPreferences, prefsChanged } = this.state;
    const toggleCheckbox = (id) => { this.toggleCheckbox(id); };
    const updatePreferencesFromProps = () => { this.updatePreferencesFromProps(); };
    return (
      <Modal
        show={showPreferences}
        onHide={() => hidePreferences()}
        onEnter={() => updatePreferencesFromProps()}
      >
        <Modal.Header closeButton>
          <Modal.Title>{D.myInterviewers}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{displaySurveys(selectedPreferences, toggleCheckbox)}</Modal.Body>
        <Modal.Footer>
          <Button
            disabled={!prefsChanged}
            onClick={() => { this.validateNewPreferences(); hidePreferences(); }}
          >
            {D.validate}
          </Button>
          <Button onClick={() => hidePreferences()}>
            {D.close}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ModalPreferences;
