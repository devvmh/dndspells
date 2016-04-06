import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import ClassSpellAssigner from './ClassSpellAssigner'
import ClassChooser from './ClassChooser'
 
class SpellAssigner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentClass: null
    }
  }

  chooseClass = e => {
    this.setState({
      ...this.state,
      currentClass: e.target.value
    })
  }

  assignSpell = spell => {
    alert("TODO")
  }

  organizeSpells = () => {
    if (this.state.currentClass === null) {
      return this.props.spells
    }
    return _.filter(this.props.spells, spell => {
      return spell.classes.indexOf(this.state.currentClass) === -1
    })
  }

  handleAssignSpell = spell => e => {
    const { currentClass } = this.state
    const { classes } = spell

    if (currentClass === null) return
    if (classes.indexOf(currentClass) !== -1) return

    const newArray = classes.concat([currentClass])
    this.props.updateSpell(spell.id, { classes: newArray })
  }

  render() {
    return (
      <div>
        <label>
          Which class's spells are you adding to? 
          <select
            value={this.state.currentClass}
            onChange={this.chooseClass}
          >
            <option>---</option>
            {props.classes.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </label>
        <div>
          <p>Here are all of the spells not in that class:</p>
          <ul>
            {props.spells.map(spell => (
              <li key={spell.id} onClick={this.handleAssignSpell(spell)}>
                {spell.name}
              </li>
            ))}
          </ul>
        </div>
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
