import React, { Component } from 'react'
import { PropTypes} from 'prop-types'
import _ from 'lodash'
 
class SpellAssigner extends Component {
  componentDidMount = () => {
    this.checkState(this.props)
  }

  componentDidUpdate = nextProps => {
    this.checkState(nextProps)
  }

  checkState = props => {
    if (!props.state) {
      props.changeTabState({
        currentClass: 'Wizard',
        currentLevel: ""
      })
    }
  }

  chooseClass = e => {
    this.props.changeTabState({
      ...this.props.state,
      currentClass: e.target.value
    })
  }

  chooseLevel = e => {
    this.props.changeTabState({
      ...this.props.state,
      currentLevel: e.target.value
    })
  }

  filteredSpellsInClass = inClass => {
    return this.props.spells.filter(spell => {
      let include = true
      if (inClass) {
        include = include && spell.classes.indexOf(this.props.state.currentClass) !== -1
      } else {
        include = include && spell.classes.indexOf(this.props.state.currentClass) === -1
      }
      if (this.props.state.currentLevel !== "") {
        include = include && spell.level === this.props.state.currentLevel
      }
      return include
    }).sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
  }

  handleAssignSpell = spell => e => {
    const { currentClass } = this.props.state
    const { classes } = spell

    if (classes.indexOf(currentClass) !== -1) return

    const newArray = classes.concat([currentClass])
    this.props.updateSpell(spell.id, { classes: newArray })
  }

  handleUnassignSpell = spell => e => {
    const { currentClass } = this.props.state
    const { classes } = spell

    const newArray = _.without(classes, currentClass)
    this.props.updateSpell(spell.id, { classes: newArray })
  }

  render = () => {
    if (!this.props.state) return null
    var self = this
    const levels = ['cantrip', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th',
                    '8th', '9th']
    return (
      <div>
        <label>
          Which class's spells are you adding to? 
          <select
            value={this.props.state.currentClass}
            onChange={this.chooseClass}
          >
            {this.props.classes.sort().map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Spell Level:
          <select
            value={this.props.state.currentLevel}
            onChange={this.chooseLevel}
          >
            <option>---</option>
            {levels.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </label>
        <table><tbody><tr><td style={{ verticalAlign: 'top' }}>
          <p>Not currently {this.props.state.currentClass} spells:</p>
          <ul>
            {this.filteredSpellsInClass(false).map(spell => (
              <li key={spell.id} onClick={self.handleAssignSpell(spell)}>
                {spell.name}
              </li>
            ))}
          </ul>
        </td><td style={{ verticalAlign: 'top' }}>
          <p>Currently assigned {this.props.state.currentClass} spells:</p>
          <ul>
            {this.filteredSpellsInClass(true).map(spell => (
              <li key={spell.id} onClick={self.handleUnassignSpell(spell)}>
                {spell.name}
              </li>
            ))}
          </ul>
        </td></tr></tbody></table>
      </div>
    )
  }
}

SpellAssigner.propTypes = ({
  spells: PropTypes.arrayOf(PropTypes.object),
  classes: PropTypes.arrayOf(PropTypes.string),
  sources: PropTypes.arrayOf(PropTypes.string),
  updateSpell: PropTypes.func,
  changeTabState: PropTypes.func,
  state: PropTypes.shape({
    currentClass: PropTypes.string,
    currentLevel: PropTypes.string
  })
})

export default SpellAssigner
