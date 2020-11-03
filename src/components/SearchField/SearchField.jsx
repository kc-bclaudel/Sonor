import React from 'react';
import D from '../../i18n';

function getMatchingLines(data, searchBy, str) {
  const s = str.toLowerCase().split(' ');

  const matchingLines = data.filter((line) => {
    const toSearch = searchBy.map((fieldName) => (line[fieldName] ? line[fieldName].toLowerCase() : ''));
    return (!s.some((word) => !toSearch.some((field) => field.includes(word))));
  });
  return matchingLines;
}

class SearchField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
    };
  }

  componentDidUpdate(prevProps) {
    const {
      data, searchBy, updateFunc,
    } = this.props;
    if (prevProps.data !== data) {
      const { inputValue } = this.state;
      updateFunc(getMatchingLines(
        data,
        searchBy,
        inputValue,
      ));
    }
    
  }

  updateInputValue(e) {
    const {
      data, searchBy, updateFunc,
    } = this.props;
    this.setState({ inputValue: e.target.value });
    updateFunc(getMatchingLines(
      data,
      searchBy,
      e.target.value,
    ));
  }

  clearSearchFeild() {
    const {
      data, searchBy, updateFunc,
    } = this.props;
    this.setState({
      inputValue: '',
    });
    updateFunc(getMatchingLines(
      data,
      searchBy,
      '',
    ));
  }

  render() {
    const { inputValue } = this.state;
    return (
      <div>
        <input
          className="SearchFieldInput"
          type="text"
          placeholder={D.search}
          value={inputValue}
          onChange={(e) => this.updateInputValue(e)}
          />
        <span id="ClearSearchInput" onClick={() => this.clearSearchFeild()}>&times;</span>
      </div>
        
    );
  }
}

export default SearchField;
