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
      groupBy: {
        level: true,
        school: false
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

  handleGroupByChange = field => e => {
    this.setState({
      ...this.state,
      groupBy: {
        ...this.state.groupBy,
        [field]: !!e.target.checked
      }
    })
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

  groupedSpells = () => {
    const { level, school } = this.state.groupBy
    if (level && school) {
      const byLevel = _.groupBy(this.filteredSpells(), 'level')
      Object.keys(byLevel).forEach(level => {
        byLevel[level] = _.groupBy(byLevel[level], 'school')
      })
      return byLevel // internal values now further grouped by school
    }
    if (level) {
      return _.groupBy(this.filteredSpells(), 'level')
    }
    if (school) {
      return _.groupBy(this.filteredSpells(), 'school')
    }
    return { all: this.filteredSpells() }
  }

  groupedSpellKeys = () => {
    const { level, school } = this.state.groupBy
    const levels = ['cantrip', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th',
                    '8th', '9th']
    const schools = ['Abjuration', 'Conjuration', 'Divination', 'Enchantment',
                     'Evocation', 'Illusion', 'Necromancy', 'Transmutation']
    if (level && school) {
      const keys = []
      levels.forEach(level => {
        schools.forEach(school => {
          keys.push(`${level}.${school}`)
        })
      })
      return keys
    }
    if (level) return levels
    if (school) return schools
    return ['all']
  }

  groupedSpellHeading = (key) => {
    const { level, school } = this.state.groupBy
    const levelHeading = key => (
      key === 'cantrip' ? 'Cantrips' : `${key} Level Spells`
    )
    if (level && school) {
      const [key1, key2] = key.split('.')
      return `${levelHeading(key1)} - ${key2}`
    }
    if (level) return levelHeading(key)
    if (school) return key
    return 'All Spells (ungrouped)'
  }

  renderClassFilter = () => {
    const { classes } = this.props
    return (
      <select value={this.state.casterClass} 
        onChange={this.handleFilterChange('casterClass')}
      >
        <option value="">--Any class--</option>
        {classes.map(c => {
          return <option key={c} value={c}>{c}</option>
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

  renderGroupingChoices = () => {
    return (
      <div>
        <label>
          <input type="checkbox"
            checked={this.state.groupBy.level}
            onChange={this.handleGroupByChange('level')}
          />
          Group by Level
        </label>
        <label>
          <input type="checkbox"
            checked={this.state.groupBy.school}
            onChange={this.handleGroupByChange('school')}
          />
          Group By School
        </label>
      </div>
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
    const spells = this.groupedSpells()
    return (
      <div>
        {this.renderClassFilter()}
        {this.renderLevelFilter()}
        {this.renderComponentFilters()}
        {this.renderSchoolFilter()}
        {this.renderGroupingChoices()}
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
          {this.groupedSpellKeys().map(key => {
            const spellGroup = _.get(spells, key)
            if (spellGroup === undefined) return null
            const heading = this.groupedSpellHeading(key)

            return (
              <tbody key={key}>
                <tr><th colSpan="5">{heading}</th></tr>
                {spellGroup.map(spell => {
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
