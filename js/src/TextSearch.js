import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

class TextSearch extends Component {
  componentDidMount = () => {
    this.checkState(this.props)
  }

  componentWillReceiveProps = nextProps => {
    this.checkState(nextProps)
  }

  checkState = props => {
    if (!props.state) {
      this.props.changeTabState({
        query: ""
      })
    }
  }

  handleChange = field => e => {
    this.props.changeTabState({
      ...this.props.state,
      [field]: e.target.value
    })
  }

  expandSpell = id => () => {
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
    if (this.props.state.filters.text) {
      const query = _.lowerCase(_.trim(this.props.state.filters.text))
      return _.filter(this.props.spells, s => {
        return _.lowerCase(s.name).indexOf(query) !== -1
      })
    }
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

  groupedSpellKeys = () => {
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
      return keys
    }
    if (groupByLevel) return levels
    if (groupBySchool) return schools
    return ['all']
  }

  groupedSpellHeading = (key) => {
    const { groupByLevel, groupBySchool } = this.props.state.checkboxes
    const levelHeading = key => (
      key === 'cantrip' ? 'Cantrips' : `${key} Level Spells`
    )
    if (groupByLevel && groupBySchool) {
      const [key1, key2] = key.split('.')
      return `${levelHeading(key1)} - ${key2}`
    }
    if (groupByLevel) return levelHeading(key)
    if (groupBySchool) return key
    return 'All Spells (ungrouped)'
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

  renderTextFilter = () => {
    return (
      <div>
        <label>
          Text Search: 
          <input type="text"
            value={this.props.state.filters.text}
            onChange={this.handleFilterChange('text')}
          />
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

  renderSpellDescription = spell => {
    if (this.props.state.checkboxes.showFullDescriptions || 
        this.props.state.expandedSpell === spell.id) {
      return `<p><strong>Casting</strong>: ${spell.casting_time}<br/>` +
        `<strong>Range</strong>: ${spell.range}<br/>` +
        `<strong>Components</strong>: ${spell.components}<br/>` +
        `<strong>Duration</strong>: ${spell.duration}</p>` +
        spell.description
    } else {
      return `${spell.description.substring(0, 90)}...`.replace('<p>', '')
    }
  }

  render = () => {
    if (!this.props.state) {
      return <div>Loading...</div>
    }
    const spells = this.groupedSpells()
    const { baseUrl } = this.props
    return (
      <div>
        {this.renderFilters()}
        {this.renderGroupingChoices()}
        {this.renderTextFilter()}
        {this.renderMiscChoices()}
        <table className="table table-striped">
          <thead><tr>
            <th>Spell</th>
            <th>Classes</th>
            <th>Level</th>
            <th>School</th>
          </tr></thead>
          {this.groupedSpellKeys().map(key => {
            const spellGroup = _.get(spells, key)
            if (spellGroup === undefined) return null
            const heading = this.groupedSpellHeading(key)

            return (
              <tbody key={key}>
                <tr><th colSpan="4">{heading}</th></tr>
                {_.flatMap(spellGroup, spell => {
                  return [(
                    <tr key={`${spell.id}-row1`}
                      className={`spell-${spell.id}`}
                      onClick={this.expandSpell(spell.id)}
                    >
                      <td>{!this.props.authenticated ? spell.name : (
                        <a href={`${baseUrl}/admin/spells/spell/${spell.id}/`}>{spell.name}</a>
                      )}</td>
                      <td>{spell.classes.join(", ")}</td>
                      <td>{spell.level}</td>
                      <td>{spell.school}{!!spell.ritual ? ' (ritual)' : ''}</td>
                    </tr>
                  ), (
                    <tr key={`${spell.id}-row2`}
                      className={`desc-${spell.id}`}
                      onClick={this.expandSpell(spell.id)}
                    >
                      <td></td>
                      <td dangerouslySetInnerHTML={{__html: this.renderSpellDescription(spell)}}
                        colSpan="3"
                      />
                    </tr>
                  )]
                })}
              </tbody>
            )
          })}
        </table>
      </div>
    )
  }
}

TextSearch.propTypes = ({
  spells: PropTypes.arrayOf(PropTypes.object),
  classes: PropTypes.arrayOf(PropTypes.string),
  authenticated: PropTypes.bool,
  baseUrl: PropTypes.string,
  createSpell: PropTypes.func,
  updateSpell: PropTypes.func,
  deleteSpell: PropTypes.func,
  changeTabState: PropTypes.func,
  state: PropTypes.shape({
    query: PropTypes.string
  })
})

export default TextSearch
