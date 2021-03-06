import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import _ from 'lodash';
import SpellViewer, { EXPAND_ALL, EXPAND_NONE } from './SpellViewer';

class SpellFilterer extends Component {
  defaultTabState = {
    filters: {
      casterClass: '',
      level: '',
      school: '',
      ritual: '',
      concentration: '',
    },
    checkboxes: {
      showFullDescriptions: false,
      groupByLevel: true,
      groupBySchool: false,
    },
    expandedSpell: null,
  }

  componentDidMount = () => {
    this.checkState(this.props);
  }

  componentDidUpdate = (nextProps) => {
    this.checkState(nextProps);
  }

  checkState = (props) => {
    if (!props.state) {
      this.props.changeTabState(this.defaultTabState);
    }
  }

  handleResetOptions = () => {
    this.props.changeTabState(this.defaultTabState);
  }

  handleFilterChange = (field) => (e) => {
    this.props.changeTabState({
      ...this.props.state,
      filters: {
        ...this.props.state.filters,
        [field]: e.target.value,
      },
    });
  }

  handleExpandSpell = (id) => () => {
    const expandedSpell = this.props.state.expandedSpell === id
      ? null
      : id;
    const newState = {
      ...this.props.state,
      expandedSpell,
    };
    this.props.changeTabState(newState);
  }

  handleCheckboxChange = (field) => (e) => {
    this.props.changeTabState({
      ...this.props.state,
      checkboxes: {
        ...this.props.state.checkboxes,
        [field]: !!e.target.checked,
      },
    });
  }

  filterClass = (spells) => {
    const { casterClass } = this.props.state.filters;
    if (casterClass === '') return spells;
    return _.filter(spells, (spell) => spell.classes.indexOf(casterClass) !== -1);
  }

  filterLevel = (spells) => {
    const { level } = this.props.state.filters;
    if (level === '') return spells;
    return _.filter(spells, (spell) => spell.level === level);
  }

  filterSchool = (spells) => {
    const { school } = this.props.state.filters;
    if (school === '') return spells;
    return _.filter(spells, (spell) => spell.school === school);
  }

  filterRitual = (spells) => {
    if (this.props.state.filters.ritual === 'true') {
      return _.filter(spells, (spell) => !!spell.ritual);
    }
    if (this.props.state.filters.ritual === 'false') {
      return _.filter(spells, (spell) => !spell.ritual);
    }
    return spells;
  }

  filterConcentration = (spells) => {
    if (this.props.state.filters.concentration === 'true') {
      return _.filter(spells, (spell) => !!spell.concentration);
    }
    if (this.props.state.filters.concentration === 'false') {
      return _.filter(spells, (spell) => !spell.concentration);
    }
    return spells;
  }

  filterSource = (spells) => _.filter(spells, (spell) => this.props.sources.includes(spell.source))

  filteredSpells = () => (
    this.filterConcentration(
      this.filterRitual(
        this.filterSchool(
          this.filterLevel(
            this.filterClass(
              this.filterSource(
                this.props.spells,
              ),
            ),
          ),
        ),
      ),
    )
  )

  groupedSpells = () => {
    const { groupByLevel, groupBySchool } = this.props.state.checkboxes;
    if (groupByLevel && groupBySchool) {
      const byLevel = _.groupBy(this.filteredSpells(), 'level');
      // internal values now further grouped by school
      return Object.keys(byLevel)
        .reduce((prev, curr) => (
          { [curr]: _.groupBy(byLevel[curr], 'school'), ...prev }),
        {});
    }
    if (groupByLevel) {
      return _.groupBy(this.filteredSpells(), 'level');
    }
    if (groupBySchool) {
      return _.groupBy(this.filteredSpells(), 'school');
    }
    return { all: this.filteredSpells() };
  }

  groupedSpellHeadings = () => {
    const { groupByLevel, groupBySchool } = this.props.state.checkboxes;
    const levels = ['cantrip', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th',
      '8th', '9th'];
    const schools = ['Abjuration', 'Conjuration', 'Divination', 'Enchantment',
      'Evocation', 'Illusion', 'Necromancy', 'Transmutation'];
    if (groupByLevel && groupBySchool) {
      const keys = [];
      levels.forEach((level) => {
        schools.forEach((school) => {
          keys.push(`${level}.${school}`);
        });
      });
      return keys.map(this.groupedSpellAddHeadings);
    }
    if (groupByLevel) return levels.map(this.groupedSpellAddHeadings);
    if (groupBySchool) return schools.map(this.groupedSpellAddHeadings);
    return ['all'].map(this.groupedSpellAddHeadings);
  }

  groupedSpellAddHeadings = (key) => {
    const { groupByLevel, groupBySchool } = this.props.state.checkboxes;
    const levelHeading = (level) => (
      level === 'cantrip' ? 'Cantrips' : `${key} Level Spells`
    );
    if (groupByLevel && groupBySchool) {
      const [key1, key2] = key.split('.');
      return [key, `${levelHeading(key1)} - ${key2}`];
    }
    if (groupByLevel) return [key, levelHeading(key)];
    if (groupBySchool) return [key, key];
    return [key, 'All Spells (ungrouped)'];
  }

  // except text filter
  renderFilters = () => {
    const classes = this.props.classes.sort();
    const levels = ['cantrip', '1st', '2nd', '3rd', '4th', '5th', '6th',
      '7th', '8th', '9th'];
    const schools = ['Abjuration', 'Conjuration', 'Divination',
      'Enchantment', 'Evocation', 'Illusion', 'Necromancy',
      'Transmutation'];
    return (
      <div>
        <select
          value={this.props.state.filters.casterClass}
          onChange={this.handleFilterChange('casterClass')}
        >
          <option value="">--Any class--</option>
          {classes.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={this.props.state.filters.level}
          onChange={this.handleFilterChange('level')}
        >
          <option value="">--Any level--</option>
          {levels.map((l) => (<option key={l} value={l}>{l}</option>))}
        </select>
        <select
          value={this.props.state.filters.school}
          onChange={this.handleFilterChange('school')}
        >
          <option value="">--Any school--</option>
          {schools.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
        <select
          value={this.props.state.filters.ritual}
          onChange={this.handleFilterChange('ritual')}
        >
          <option value="">-- Ritual? --</option>
          <option value="true">Ritual spells only</option>
          <option value="false">Exclude ritual spells</option>
        </select>
        <select
          value={this.props.state.filters.concentration}
          onChange={this.handleFilterChange('concentration')}
        >
          <option value="">-- Concentration? --</option>
          <option value="true">Concentration spells only</option>
          <option value="false">Exclude concentration spells</option>
        </select>
      </div>
    );
  }

  renderGroupingChoices = () => (
    <div>
      <label>
        <input
          type="checkbox"
          checked={this.props.state.checkboxes.groupByLevel}
          onChange={this.handleCheckboxChange('groupByLevel')}
        />
        Group by Level
      </label>
      <label>
        <input
          type="checkbox"
          checked={this.props.state.checkboxes.groupBySchool}
          onChange={this.handleCheckboxChange('groupBySchool')}
        />
        Group By School
      </label>
    </div>
  )

  renderMiscChoices = () => (
    <div>
      <label>
        <input
          type="checkbox"
          checked={this.props.state.checkboxes.showFullDescriptions}
          onChange={this.handleCheckboxChange('showFullDescriptions')}
        />
        Show full descriptions
      </label>
      <br />
      <button type="button" onClick={this.handleResetOptions}>Reset all options</button>
    </div>
  )

  render = () => {
    if (!this.props.state) {
      return <div>Loading...</div>;
    }
    const { expandedSpell } = this.props.state || EXPAND_NONE;
    const showAll = this.props.state.checkboxes.showFullDescriptions;

    return (
      <div>
        {this.renderFilters()}
        {this.renderGroupingChoices()}
        {this.renderMiscChoices()}
        <SpellViewer
          groupedSpells={this.groupedSpells()}
          groupedSpellHeadings={this.groupedSpellHeadings()}
          expandedSpell={showAll ? EXPAND_ALL : expandedSpell}
          onExpandSpell={this.handleExpandSpell}
          updateSpell={this.props.updateSpell}
          authenticated={this.props.authenticated}
        />
      </div>
    );
  }
}

// eslint-disable-next-line immutable/no-mutation
SpellFilterer.propTypes = ({
  spells: PropTypes.arrayOf(PropTypes.object),
  sources: PropTypes.arrayOf(PropTypes.string),
  classes: PropTypes.arrayOf(PropTypes.string),
  authenticated: PropTypes.bool,
  changeTabState: PropTypes.func,
  updateSpell: PropTypes.func,
  state: PropTypes.shape({
    filters: PropTypes.shape({
      casterClass: PropTypes.string,
      level: PropTypes.string,
      school: PropTypes.string,
      concentration: PropTypes.bool,
      ritual: PropTypes.bool,
    }),
    checkboxes: PropTypes.shape({
      groupByLevel: PropTypes.bool,
      groupBySchool: PropTypes.bool,
      showFullDescriptions: PropTypes.bool,
      ritualOnly: PropTypes.bool,
    }),
    expandedSpell: PropTypes.number,
  }),
});

export default SpellFilterer;
