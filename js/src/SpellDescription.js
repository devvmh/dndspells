import React, { Component } from 'react'
import { PropTypes} from 'prop-types'
import _ from 'lodash'

class SpellDescription extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      description: this.props.spell.description
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      description: nextProps.spell.description
    }
  }

  startEditing = e => {
    e.preventDefault()
    e.stopPropagation()

    this.setState({ editing: true })
  }

  stopEditing = e => {
    e.preventDefault()
    e.stopPropagation()

    this.props.updateSpell(this.props.spell.id, {
      description: this.state.description
    })
    this.setState({ editing: false, description: this.state.description })
  }

  handleChange = field => e => {
    this.setState({
      [field]: e.target.value
    })
  }

  renderDescription = () => {
    const innerHTML = {
      __html: this.props.spell.description
    }

    if (this.props.authenticated && this.state.editing) {
      innerHTML.__html = ''
    }

    return <p dangerouslySetInnerHTML={innerHTML} />
  }

  renderEditor = () => {
    const { spell } = this.props
    if (this.props.authenticated && this.state.editing) {
      return (
        <textarea value={this.state.description}
          onChange={this.handleChange('description')}
          rows={5} cols={80}
          style={{ maxWidth: '100%' }}
        />
      )
    } else {
      return null
    }
  }

  renderEditOptions = () => {
    if (!this.props.authenticated) {
      return null
    }
    if (this.state.editing) {
      return <a onClick={this.stopEditing}>stop editing</a>
    } else {
      return <a onClick={this.startEditing}>edit</a>
    }
  }

  abbreviate = desc => {
    // strip html tags - won't handle attributes though
    return desc.substring(0, 90).replace(/<\/?\w+>/g, '')
  }

  render = () => {
    const { spell, expanded, updateSpell } = this.props
    if (!expanded) {
      return <div><p>
        {`${this.abbreviate(spell.description)}...`}
      </p></div>
    }

    const concentration = spell.concentration ? 'Concentration, ' : ''
    return (
      <div>
        <p>
          <strong>Casting</strong>: {spell.casting_time}<br />
          <strong>Range</strong>: {spell.range}<br />
          <strong>Components</strong>: {spell.components}<br />
          <strong>Duration</strong>: {concentration} {spell.duration}
        </p>
        <div>{this.renderDescription()}</div>
        {this.renderEditor()}
        {
          // this.renderEditOptions() // disabled
        }
      </div>
    )
  }
}

SpellDescription.propTypes = {
  spell: PropTypes.object,
  expanded: PropTypes.bool,
  authenticated: PropTypes.bool,
  updateSpell: PropTypes.func
}

export default SpellDescription
