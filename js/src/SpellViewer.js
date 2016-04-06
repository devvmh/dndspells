import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

class SpellViewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filters: {
        casterClass: "",
        level: "",
        components: {
          V: true,
          S: true,
          M: true
        },
        school: ""
      },
      expandedSpell: null
    }
  }

  handleFilterChange = field => e => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        [field]: e.target.value
      }
    })
  }

  expandSpell = id => () => {
    const newState = this.state
    if (this.state.expandedSpell === id) {
      newState.expandedSpell = null
    } else {
      newState.expandedSpell = id
    }
    this.setState(newState)
  }

  filterClass = spells => {
    const { casterClass } = this.state.filters
    if (casterClass === "") return spells
    return _.filter(spells, spell => spell.classes.indexOf(casterClass) !== -1)
  }

  filterLevel = spells => {
    const { level } = this.state.filters
    if (level === "") return spells
    return _.filter(spells, spell => spell.level === level)
  }

  filterComponents = spells => {
    // TODO
    return spells
  }

  filterSchool = spells => {
    const { school } = this.state.filters
    if (school === "") return spells
    return _.filter(spells, spell => spell.school === school)
  }

  filteredSpells = () => {
    return (
      this.filterSchool(
      this.filterComponents(
      this.filterLevel(
      this.filterClass(
        this.props.spells))))
    )
  }

  renderableSpells = () => {
    return _.groupBy(this.filteredSpells(), 'level')
  }

  renderClassFilter = () => {
    const { classes } = this.props
    return (
      <select value={this.state.casterClass} 
        onChange={this.handleFilterChange('casterClass')}
      >
        <option value="">--Any class--</option>
        {classes.map(c => {
          return <option key={c.name} value={c.name}>{c.name}</option>
        })}
      </select>
    )
  }

  renderLevelFilter = () => {
    const levels = ['cantrip', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th',
                    '8th', '9th']
    return (
      <select value={this.state.level}
        onChange={this.handleFilterChange('level')}
      >
        <option value="">--Any level--</option>
        {levels.map(l => (<option key={l}>{l}</option>))}
      </select>
    )
  }

  renderComponentFilters = () => {
    return null // TODO
  }

  renderSchoolFilter = () => {
    const schools = ['Abjuration', 'Conjuration', 'Divination', 'Enchantment',
                     'Evocation', 'Illusion', 'Necromancy', 'Transmutation']
    return (
      <select value={this.state.school}
        onChange={this.handleFilterChange('school')}
      >
        <option value="">--Any school--</option>
        {schools.map(s => (<option key={s}>{s}</option>))}
      </select>
    )
  }

  renderSpellDescription = spell => {
    if (this.state.expandedSpell === spell.id) {
      return spell.description
    } else {
      return `${spell.description.substring(0, 50)}...`
    }
  }

  render = () => {
    const spellsByLevel = this.renderableSpells()
    const levels = ['cantrip', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th',
                    '8th', '9th']
    return (
      <div>
        {this.renderClassFilter()}
        {this.renderLevelFilter()}
        {this.renderComponentFilters()}
        {this.renderSchoolFilter()}
        <table className="table table-striped">
          <colgroup span="4" />
          <colgroup style={{ width: "50%" }} />
          <thead><tr>
            <th>Spell</th>
            <th>Classes</th>
            <th>Components</th>
            <th>School</th>
            <th>Description (click me!)</th>
          </tr></thead>
          {levels.map(level => {
            const spells = spellsByLevel[level]
            if (spells === undefined) return null
            const levelDisplay = (
              level === 'cantrip' ? 'Cantrips' : `${level} Level Spells`
            )

            return (
              <tbody key={level}>
                <tr><th>{levelDisplay}</th><th /><th /><th /><th /></tr>
                {spells.map(spell => {
                  return (
                    <tr key={spell.id} className={`spell-${spell.id}`}>
                      <td>{spell.name}</td>
                      <td>{spell.classes.join(", ")}</td>
                      <td>{spell.components}</td>
                      <td>{spell.school}</td>
                      <td onClick={this.expandSpell(spell.id)}>
                        {this.renderSpellDescription(spell)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            )
          })}
        </table>
      </div>
    )
  }
}

export default SpellViewer
