import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

class SourceSelector extends Component {
  constructor(props) {
    super(props);

    // eslint-disable-next-line immutable/no-mutation
    this.state = {
      expanded: true,
    };
  }

  // eslint-disable-next-line no-unused-vars
  handleToggleExpanded = (_e) => {
    this.setState((prevState) => ({
      expanded: !prevState.expanded,
    }));
  }

  handleCheckboxChange = (source) => (e) => {
    e.preventDefault();
    const newSources = e.target.checked
      ? this.props.sources.concat(source)
      : this.props.sources.filter((s) => s !== source);
    this.props.updateSources(newSources);
  }

  render = () => (
    <div className="spell-sources">
      {this.state.expanded && this.props.potentialSources.map((source) => (
        <fieldset className="spell-source-fieldset" key={source}>
          <input
            type="checkbox"
            className="spell-source-checkbox"
            name={source}
            defaultChecked={this.props.sources.includes(source)}
            onBlur={this.handleCheckboxChange(source)}
          />
          <label
            name={source}
            className="spell-source-label"
          >
            {source}
          </label>
        </fieldset>
      ))}
      <div className="spell-source-expander-div">
        <button
          type="button"
          className="btn btn-link spell-source-expander-link"
          onClick={this.handleToggleExpanded}
        >
          {`${this.state.expanded ? 'hide' : 'show'} spell sources`}
        </button>
      </div>
    </div>
  )
}

// eslint-disable-next-line immutable/no-mutation
SourceSelector.propTypes = ({
  sources: PropTypes.arrayOf(PropTypes.string),
  potentialSources: PropTypes.arrayOf(PropTypes.string),
  updateSources: PropTypes.func,
});

export default SourceSelector;
