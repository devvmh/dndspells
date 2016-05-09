import React, { PropTypes, Component } from 'react'
import SpellFilterer from './SpellFilterer'
import { Typeahead } from 'react-typeahead'

class MySpellBook extends Component {
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
    this.props.changeTabState({ filtererState })
  }

  handleSpellbookAdd = option => {
    console.log(option)
  }

  handleSpellbookRemove = option => {
    console.log(option)
  }

  handleBackupValueChange = e => {
    try {
      const spellbook = JSON.parse(e.target.value)
      this.props.changeTabState({ spellbook })
    } catch (error) {
      alert("Backup data was invalid :(")
      console.error(error)
    }
  }

  renderSpellbookBackup = () => {
    return (
      <div>
        <p>To backup your spellbook, copy this text to a file. You can paste it here to restore the backup later.</p>
        <textarea onChange={this.handleBackupValueChange} >
          {JSON.stringify(this.props.state.spellbook)}
        </textarea>
      </div>
    )
  }

  render = () => {
    if (!this.props.state) {
      return <p>Loading...</p>
    }
    return (
      <div>
        <Typeahead onOptionSelected={this.handleSpellbookAdd}
          options={this.props.spells.map(spell => spell.name)}
        />
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

MySpellBook.propTypes = {
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

export default MySpellBook
