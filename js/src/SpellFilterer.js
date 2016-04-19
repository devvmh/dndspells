import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import SpellViewer, { EXPAND_ALL, EXPAND_NONE } from './SpellViewer'

class SpellFilterer extends Component {
  componentDidMount = () => {
    this.checkState(this.props)
  }

  componentWillReceiveProps = nextProps => {
    this.checkState(nextProps)
  }

  checkState = props => {
    if (!props.state) {
      this.props.changeTabState({
        filters: {
          casterClass: "",
          level: "",
          school: "",
          ritual: ""
        },
        checkboxes: {
          showFullDescriptions: false,
          groupByLevel: true,
          groupBySchool: false,
        },
        expandedSpell: null
      })
    }
  }

  handleFilterChange = field => e => {
    this.props.changeTabState({
      ...this.props.state,
      filters: {
        ...this.props.state.filters,
        [field]: e.target.value
      }
    })
  }

  handleExpandSpell = id => () => {
    const newState = this.props.state
    if (this.props.state.expandedSpell === id) {
      newState.expandedSpell = null
    } else {
      newState.expandedSpell = id
    }
    this.props.changeTabState(newState)
  }

  handleCheckboxChange = field => e => {
    this.props.changeTabState({
      ...this.props.state,
      checkboxes: {
        ...this.props.state.checkboxes,
        [field]: !!e.target.checked
      }
    })
  }

  filterClass = spells => {
    const { casterClass } = this.props.state.filters
    if (casterClass === "") return spells
    return _.filter(spells, spell => spell.classes.indexOf(casterClass) !== -1)
  }

  filterLevel = spells => {
    const { level } = this.props.state.filters
    if (level === "") return spells
    return _.filter(spells, spell => spell.level === level)
  }

  filterSchool = spells => {
    const { school } = this.props.state.filters
    if (school === "") return spells
    return _.filter(spells, spell => spell.school === school)
  }

  filterRitual = spells => {
    if (this.props.state.filters.ritual == "true") {
      return _.filter(spells, spell => !!spell.ritual)
    }
    if (this.props.state.filters.ritual == "false") {
      return _.filter(spells, spell => !spell.ritual)
    }
    return spells
  }

  filteredSpells = () => {
    return (
      this.filterRitual(
      this.filterSchool(
      this.filterLevel(
      this.filterClass(
        this.props.spells))))
    )
  }

  groupedSpells = () => {
    const { groupByLevel, groupBySchool } = this.props.state.checkboxes
    if (groupByLevel && groupBySchool) {
      const byLevel = _.groupBy(this.filteredSpells(), 'level')
      Object.keys(byLevel).forEach(level => {
        byLevel[level] = _.groupBy(byLevel[level], 'school')
      })
      return byLevel // internal values now further grouped by school
    }
    if (groupByLevel) {
      return _.groupBy(this.filteredSpells(), 'level')
    }
    if (groupBySchool) {
      return _.groupBy(this.filteredSpells(), 'school')
    }
    return { all: this.filteredSpells() }
  }

  groupedSpellHeadings = () => {
    const { groupByLevel, groupBySchool } = this.props.state.checkboxes
    const levels = ['cantrip', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th',
                    '8th', '9th']
    const schools = ['Abjuration', 'Conjuration', 'Divination', 'Enchantment',
                     'Evocation', 'Illusion', 'Necromancy', 'Transmutation']
    if (groupByLevel && groupBySchool) {
      const keys = []
      levels.forEach(level => {
        schools.forEach(school => {
          keys.push(`${level}.${school}`)
        })
      })
      return keys.map(this.groupedSpellAddHeadings)
    }
    if (groupByLevel) return levels.map(this.groupedSpellAddHeadings)
    if (groupBySchool) return schools.map(this.groupedSpellAddHeadings)
    return ['all'].map(this.groupedSpellAddHeadings)
  }

  groupedSpellAddHeadings = (key) => {
    const { groupByLevel, groupBySchool } = this.props.state.checkboxes
    const levelHeading = key => (
      key === 'cantrip' ? 'Cantrips' : `${key} Level Spells`
    )
    if (groupByLevel && groupBySchool) {
      const [key1, key2] = key.split('.')
      return [key, `${levelHeading(key1)} - ${key2}`]
    }
    if (groupByLevel) return [key, levelHeading(key)]
    if (groupBySchool) return [key, key]
    return [key, 'All Spells (ungrouped)']
  }

  // except text filter
  renderFilters = () => {
    const { classes } = this.props
    const levels = ['cantrip', '1st', '2nd', '3rd', '4th', '5th', '6th',
                    '7th', '8th', '9th']
    const schools = ['Abjuration', 'Conjuration', 'Divination',
                     'Enchantment', 'Evocation', 'Illusion', 'Necromancy',
                     'Transmutation']
    return (
      <div>
        <select value={this.props.state.filters.casterClass} 
          onChange={this.handleFilterChange('casterClass')}
        >
          <option value="">--Any class--</option>
          {classes.map(c => {
            return <option key={c} value={c}>{c}</option>
          })}
        </select>
        <select value={this.props.state.filters.level}
          onChange={this.handleFilterChange('level')}
        >
          <option value="">--Any level--</option>
          {levels.map(l => (<option key={l} value={l}>{l}</option>))}
        </select>
        <select value={this.props.state.filters.school}
          onChange={this.handleFilterChange('school')}
        >
          <option value="">--Any school--</option>
          {schools.map(s => (<option key={s} value={s}>{s}</option>))}
        </select>
        <select value={this.props.state.filters.ritual}
          onChange={this.handleFilterChange('ritual')}
        >
          <option value="">-- Ritual? --</option>
          <option value="true">Ritual spells only</option>
          <option value="false">Exclude ritual spells</option>
        </select>
      </div>
    )
  }

  renderGroupingChoices = () => {
    return (
      <div>
        <label>
          <input type="checkbox"
            checked={this.props.state.checkboxes.groupByLevel}
            onChange={this.handleCheckboxChange('groupByLevel')}
          />
          Group by Level
        </label>
        <label>
          <input type="checkbox"
            checked={this.props.state.checkboxes.groupBySchool}
            onChange={this.handleCheckboxChange('groupBySchool')}
          />
          Group By School
        </label>
      </div>
    )
  }

  renderMiscChoices = () => {
    return (
      <div>
        <label>
          <input type="checkbox"
            checked={this.props.state.checkboxes.showFullDescriptions}
            onChange={this.handleCheckboxChange('showFullDescriptions')}
          />
          Show full descriptions
        </label>
      </div>
    )
  }

  render = () => {
    if (!this.props.state) {
      return <div>Loading...</div>
    }
    const spells = this.groupedSpells()
    const { baseUrl } = this.props
    const { expandedSpell } = this.props.state || EXPAND_NONE
    const showAll = this.props.state.checkboxes.showFullDescriptions

    return (
      <div>
        {this.renderFilters()}
        {this.renderGroupingChoices()}
        {this.renderMiscChoices()}
        <SpellViewer groupedSpells={this.groupedSpells()}
          groupedSpellHeadings={this.groupedSpellHeadings()}
          expandedSpell={showAll ? EXPAND_ALL : expandedSpell}
          onExpandSpell={this.handleExpandSpell}
          baseUrl={this.props.baseUrl}
          authenticated={this.props.authenticated}
        />
      </div>
    )
  }
}

SpellFilterer.propTypes = ({
  spells: PropTypes.arrayOf(PropTypes.object),
  classes: PropTypes.arrayOf(PropTypes.string),
  authenticated: PropTypes.bool,
  baseUrl: PropTypes.string,
  changeTabState: PropTypes.func,
  state: PropTypes.shape({
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

export default SpellFilterer
