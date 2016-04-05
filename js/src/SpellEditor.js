import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

class SpellEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentClass: null,
      spells: props.spells
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
    return this.state.spells
  }

  render() {
    return (
      <div>
        <ClassChooser onChange={this.chooseClass}
          currentClass={this.state.currentClass}
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
    <input type="text"
      value={props.currentClass}
      onChange={props.onChange}
    />
  </label>
)

export default SpellEditor
