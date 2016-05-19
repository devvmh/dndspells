import React, { PropTypes, Component } from 'react'
import SpellFilterer from './SpellFilterer'
import { Typeahead } from 'react-typeahead'

class SavedSpellbook extends Component {
  componentDidMount = () => {
    this.checkState(this.props)
  }

  componentWillReceiveProps = nextProps => {
    this.checkState(nextProps)
  }

  defaultTabState = {
    spellbook: [],
    filtererState: null
  }

  checkState = props => {
    if (!props.state) {
      this.props.changeTabState(this.defaultTabState)
    }
  }

  handleChangeFiltererState = filtererState => {
    const newState = this.props.state
    newState.filtererState = filtererState
    this.props.changeTabState(newState)
  }

  handleSpellbookAdd = e => {
    const spellbook = this.props.state.spellbook
    const spell = this.props.spells.filter(item => item.id == e.target.value).pop()
    spellbook.push(spell)
    const newState = this.props.state
    newState.spellbook = spellbook
    this.props.changeTabState(newState)
  }

  handleSpellbookRemove = e => {
    const spellbook = this.props.state.spellbook
    const spell_id = e.target.value
    const newState = this.props.state
    newState.spellbook = spellbook.filter(spell => spell.id != spell_id)
    this.props.changeTabState(newState)
  }

  handleBackupValueChange = e => {
    try {
      const spellbook = JSON.parse(e.target.value)
      const newState = this.props.state
      newState.spellbook = spellbook
      this.props.changeTabState(newState)
    } catch (error) {
      alert("Backup data was invalid :(")
      console.error(error)
    }
  }

  renderSpellbookBackup = () => {
    return (
      <div>
        <p>To backup your spellbook, copy this text to a file. You can paste it here to restore the backup later.</p>
        <textarea onChange={this.handleBackupValueChange}
          value={JSON.stringify(this.props.state.spellbook)}
        />
      </div>
    )
  }

  // <Typeahead onOptionSelected={this.handleSpellbookAdd}
  //   options={this.props.spells.map(spell => spell.name)}
  // />

  render = () => {
    if (!this.props.state) {
      return <p>Loading...</p>
    }
    return (
      <div>
        <select onChange={this.handleSpellbookAdd}>
          <option>-- Add spell --</option>
          {this.props.spells.map(spell => (
            <option key={spell.id} value={spell.id}>{spell.name}</option>
          ))}
        </select>
        <select onChange={this.handleSpellbookRemove}>
          <option>-- Remove spell --</option>
          {this.props.state.spellbook.map(spell => (
            <option key={spell.id} value={spell.id}>{spell.name}</option>
          ))}
        </select>
        <SpellFilterer spells={this.props.state.spellbook || []}
          classes={this.props.classes}
          authenticated={this.props.authenticated}
          updateSpell={this.props.updateSpell}
          changeTabState={this.handleChangeFiltererState}
          state={this.props.state.filtererState}
        />
        {this.renderSpellbookBackup()}
      </div>
    )
  }
}

SavedSpellbook.propTypes = {
  spells: PropTypes.arrayOf(PropTypes.object),
  classes: PropTypes.arrayOf(PropTypes.string),
  authenticated: PropTypes.bool,
  changeTabState: PropTypes.func,
  updateSpell: PropTypes.func,
  state: PropTypes.shape({
    spellbook: PropTypes.arrayOf(PropTypes.object),
    filtererState: PropTypes.shape({
      filters: PropTypes.shape({
        casterClass: PropTypes.string,
        level: PropTypes.string,
        school: PropTypes.string
      }),
      checkboxes: PropTypes.shape({
        groupByLevel: PropTypes.bool,
        groupBySchool: PropTypes.bool,
        showFullDescriptions: PropTypes.bool,
        ritualOnly: PropTypes.bool
      }),
      expandedSpell: PropTypes.number
    })
  })
}

export default SavedSpellbook
