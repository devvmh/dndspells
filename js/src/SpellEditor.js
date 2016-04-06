import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

class SpellEditor extends Component {
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

  render() {
    return (
      <div>
        <ClassChooser onChange={this.chooseClass}
          currentClass={this.state.currentClass}
          classes={this.props.classes}
        />
        <ClassSpellAssigner onAssign={this.assignSpell} 
          currentClass={this.state.currentClass}
          spells={this.organizeSpells()}
        />
      </div>
    )
  }
}

const ClassSpellAssigner = (props) => (
  <div>
    <p>Here are all of the spells not in that class:</p>
    <ul>
      {props.spells.map(spell => (
        <li key={spell.id}>{spell.name}</li>
      ))}
    </ul>
  </div>
)

const ClassChooser = (props) => (
  <label>
    Which class's spells are you adding to? 
    <select
      value={props.currentClass}
      onChange={props.onChange}
    >
      <option>--Any class--</option>
      {props.classes.map(c => (
        <option key={c.name} value={c.name}>{c.name}</option>
      ))}
    </select>
  </label>
)

export default SpellEditor
