import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

class SpellViewer extends Component {
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
          school: ""
        },
        groupBy: {
          level: true,
          school: false
        },
        showFullDescriptions: false,
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

  expandSpell = id => () => {
    const newState = this.props.state
    if (this.props.state.expandedSpell === id) {
      newState.expandedSpell = null
    } else {
      newState.expandedSpell = id
    }
    this.props.changeTabState(newState)
  }

  handleGroupByChange = field => e => {
    this.props.changeTabState({
      ...this.props.state,
      groupBy: {
        ...this.props.state.groupBy,
        [field]: !!e.target.checked
      }
    })
  }

  handleShowDescChange = e => {
    this.props.changeTabState({
      ...this.props.state,
      showFullDescriptions: e.target.checked
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

  filterComponents = spells => {
    // TODO
    return spells
  }

  filterSchool = spells => {
    const { school } = this.props.state.filters
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
    const { level, school } = this.props.state.groupBy
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
    const { level, school } = this.props.state.groupBy
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
    const { level, school } = this.props.state.groupBy
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
      <select value={this.props.state.casterClass} 
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
      <select value={this.props.state.level}
        onChange={this.handleFilterChange('level')}
      >
        <option value="">--Any level--</option>
        {levels.map(l => (<option key={l}>{l}</option>))}
      </select>
    )
  }

  renderSchoolFilter = () => {
    const schools = ['Abjuration', 'Conjuration', 'Divination', 'Enchantment',
                     'Evocation', 'Illusion', 'Necromancy', 'Transmutation']
    return (
      <select value={this.props.state.school}
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
            checked={this.props.state.groupBy.level}
            onChange={this.handleGroupByChange('level')}
          />
          Group by Level
        </label>
        <label>
          <input type="checkbox"
            checked={this.props.state.groupBy.school}
            onChange={this.handleGroupByChange('school')}
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
            checked={this.props.state.showFullDescriptions}
            onChange={this.handleShowDescChange}
          />
          Show full descriptions
        </label>
      </div>
    )
  }

  renderSpellDescription = spell => {
    if (this.props.state.showFullDescriptions || 
        this.props.state.expandedSpell === spell.id) {
      return `<p><strong>Casting</strong>: ${spell.casting_time}<br/>` +
        `<strong>Range</strong>: ${spell.range}<br/>` +
        `<strong>Components</strong>: ${spell.components}<br/>` +
        `<strong>Duration</strong>: ${spell.duration}</p>` +
        spell.description
    } else {
      return `${spell.description.substring(0, 100)}...`.replace('<p>', '')
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
        {this.renderClassFilter()}
        {this.renderLevelFilter()}
        {this.renderSchoolFilter()}
        {this.renderGroupingChoices()}
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
                      <td>{spell.school}</td>
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

SpellViewer.propTypes = ({
  spells: PropTypes.arrayOf(PropTypes.object),
  classes: PropTypes.arrayOf(PropTypes.string),
  authenticated: PropTypes.bool,
  baseUrl: PropTypes.string,
  createSpell: PropTypes.func,
  updateSpell: PropTypes.func,
  deleteSpell: PropTypes.func,
  changeTabState: PropTypes.func,
  state: PropTypes.shape({
    filters: PropTypes.shape({
      casterClass: PropTypes.string,
      level: PropTypes.string,
      school: PropTypes.string
    }),
    groupBy: PropTypes.shape({
      level: PropTypes.bool,
      school: PropTypes.bool
    }),
    showFullDescriptions: PropTypes.bool,
    expandedSpell: PropTypes.number
  })
})

export default SpellViewer
