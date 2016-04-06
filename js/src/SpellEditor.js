import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

class SpellEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentClass: null
    }
  }

  chooseClass = newClass => {
    this.setState({
      ...state,
      currentClass: newClass
    })
  }

  assignSpell = spell => {
    alert("TODO")
  }

  organizeSpells = () => {
    return this.props.spells
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
    <p>Here are all of the spells:</p>
    <ul>
      {props.spells.map(spell => (
        <li key={spell.id}>{spell.name}</li>
      ))}
    </ul>
  </div>
)

const ClassChooser = (props) => (
  <label>
    Which class do you want?
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
