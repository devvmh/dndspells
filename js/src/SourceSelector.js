import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

class SourceSelector extends Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: true
    }
  }

  handleToggleExpanded = e => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  handleCheckboxChange = source => e => {
    e.preventDefault()
    const newSources = !!e.target.checked
      ? this.props.sources.concat(source)
      : this.props.sources.filter(s => s != source)
    this.props.updateSources(newSources)
  }

  render = () => {
    return (
      <div className="spell-sources">
        {this.state.expanded && this.props.potentialSources.map(source => {
          return (
            <fieldset className="spell-source-fieldset" key={source}>
              <input type="checkbox"
                className="spell-source-checkbox"
                name={source}
                defaultChecked={this.props.sources.includes(source)}
                onBlur={this.handleCheckboxChange(source)}
              />
              <label name={source}
                className="spell-source-label"
              >
                {source}
              </label>
            </fieldset>
          )
        })}
        <div className="spell-source-expander-div">
          <a onClick={this.handleToggleExpanded}
            className="spell-source-expander-link"
          >
            {`${this.state.expanded ? 'hide' : 'show'} spell sources`}
          </a>
        </div>
      </div>
    )
  }
}

SourceSelector.propTypes = ({
  sources: PropTypes.arrayOf(PropTypes.string),
  potentialSources: PropTypes.arrayOf(PropTypes.string),
  updateSources: PropTypes.func
})

export default SourceSelector
