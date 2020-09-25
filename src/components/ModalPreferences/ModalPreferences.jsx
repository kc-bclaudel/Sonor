import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import D from '../../i18n';

function displaySurveys(preferences, toggleCheckbox) {
  const lines = Object.keys(preferences).map((key) => (
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
    </tr>
  ));

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
    this.state = {
      selectedPreferences: JSON.parse(JSON.stringify(props.preferences)),
      prefsChanged: false,
    };
  }

  validateNewPreferences() {
    const { selectedPreferences } = this.state;
    const { updatePreferences } = this.props;
    updatePreferences(Object.keys(selectedPreferences).filter(
      (id) => selectedPreferences[id].preference,
    ));
  }

  updatePreferencesFromProps() {
    const { preferences } = this.props;
    this.setState({
      selectedPreferences: JSON.parse(JSON.stringify(preferences)),
      prefsChanged: false,
    });
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
          <Modal.Title>{D.mySurveys}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{displaySurveys(selectedPreferences, toggleCheckbox)}</Modal.Body>
        <Modal.Footer>
          <Button
            data-testid="validate-pref-modif"
            disabled={!prefsChanged}
            onClick={() => { this.validateNewPreferences(); hidePreferences(); }}
          >
            {D.validate}
          </Button>
          <Button
            data-testid="close-preferences-button"
            onClick={() => hidePreferences()}
          >
            {D.close}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ModalPreferences;
