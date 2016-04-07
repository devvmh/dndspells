import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
 
class SpellAssigner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentClass: 'Wizard'
    }
  }

  chooseClass = e => {
    this.setState({
      ...this.state,
      currentClass: e.target.value
    })
  }

  spellsInClass = inClass => {
    if (this.state.currentClass === null) {
      return this.props.spells
    }
    return _.filter(this.props.spells, spell => {
      if (inClass) {
        return spell.classes.indexOf(this.state.currentClass) !== -1
      } else {
        return spell.classes.indexOf(this.state.currentClass) === -1
      }
    })
  }

  handleAssignSpell = spell => e => {
    const { currentClass } = this.state
    const { classes } = spell

    if (classes.indexOf(currentClass) !== -1) return

    const newArray = classes.concat([currentClass])
    this.props.updateSpell(spell.id, { classes: newArray })
  }

  handleUnassignSpell = spell => e => {
    const { currentClass } = this.state
    const { classes } = spell

    const newArray = _.without(classes, currentClass)
    this.props.updateSpell(spell.id, { classes: newArray })
  }

  render() {
    var self = this
    return (
      <div>
        <label>
          Which class's spells are you adding to? 
          <select
            value={this.state.currentClass}
            onChange={this.chooseClass}
          >
            {this.props.classes.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <table><tbody><tr><td style={{ verticalAlign: 'top' }}>
          <p>Not currently {this.state.currentClass} spells:</p>
          <ul>
            {this.spellsInClass(false).map(spell => (
              <li key={spell.id} onClick={self.handleAssignSpell(spell)}>
                {spell.name}
              </li>
            ))}
          </ul>
        </td><td style={{ verticalAlign: 'top' }}>
          <p>Currently assigned {this.state.currentClass} spells:</p>
          <ul>
            {this.spellsInClass(true).map(spell => (
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
  createSpell: PropTypes.func,
  updateSpell: PropTypes.func,
  deleteSpell: PropTypes.func
})

export default SpellAssigner
