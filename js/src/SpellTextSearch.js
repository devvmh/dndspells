import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import SpellViewer from './SpellViewer'

class SpellTextSearch extends Component {
  componentDidMount = () => {
    this.checkState(this.props)
  }

  componentWillReceiveProps = nextProps => {
    this.checkState(nextProps)
  }

  checkState = props => {
    if (!props.state) {
      this.props.changeTabState({
        query: "",
        searchDesc: false
      })
    }
  }

  handleChange = field => e => {
    const t = e.target
    const value = t.type === 'checkbox' ? t.checked : t.value
    this.props.changeTabState({
      ...this.props.state,
      [field]: value
    })
  }

  filteredSpells = () => {
    const query = _.lowerCase(this.props.state.query)
    const { searchDesc } = this.props.state
    if (query === "") return this.props.spells
    return _.filter(this.props.spells, spell => {
      return _.lowerCase(spell.name).indexOf(query) !== -1 ||
        (searchDesc && query.length > 2 && _.lowerCase(spell.description).indexOf(query) !== -1)
    })
  }

  groupedSpells = () => {
    return { all: this.filteredSpells() }
  }

  groupedSpellHeadings = () => {
    return [ ['all', 'Search results:'] ]
  }

  renderMiscChoices = () => {
    return (
      <div>
        <label>
          Search descriptions too (min 3 chars): 
          <input type="checkbox"
            checked={this.props.state.searchDesc}
            onChange={this.handleChange('searchDesc')}
          />
        </label>
      </div>
    )
  }

  renderTextSearch = () => {
    return (
      <div>
        <label>
          Search spells by name: 
          <input type="text"
            value={this.props.state.query}
            onChange={this.handleChange('query')}
          />
        </label>
      </div>
    )
  }

  render = () => {
    if (!this.props.state) return null
    const spells = this.groupedSpells()
    return (
      <div>
        {this.renderTextSearch()}
        {this.renderMiscChoices()}
        <SpellViewer groupedSpells={this.groupedSpells()}
          groupedSpellHeadings={this.groupedSpellHeadings()}
          expandedSpell={0}
          onExpandSpell={() => null}
          baseUrl={this.props.baseUrl}
          authenticated={this.props.authenticated}
        />
      </div>
    )
  }
}

SpellTextSearch.propTypes = ({
  spells: PropTypes.arrayOf(PropTypes.object),
  classes: PropTypes.arrayOf(PropTypes.string),
  authenticated: PropTypes.bool,
  baseUrl: PropTypes.string,
  createSpell: PropTypes.func,
  updateSpell: PropTypes.func,
  deleteSpell: PropTypes.func,
  changeTabState: PropTypes.func,
  state: PropTypes.shape({
    query: PropTypes.string,
    searchDesc: PropTypes.bool
  })
})

export default SpellTextSearch
