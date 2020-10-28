/* global window */

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import _ from 'lodash';
import SpellViewer from './SpellViewer';

class SpellTextSearch extends Component {
  componentDidMount = () => {
    this.checkState(this.props);
  }

  componentDidUpdate = (nextProps) => {
    this.checkState(nextProps);
  }

  checkState = (props) => {
    if (!props.state) {
      this.props.changeTabState({
        query: '',
        searchDesc: false,
      });
    }
  }

  handleChange = (field) => (e) => {
    const t = e.target;
    const value = t.type === 'checkbox' ? t.checked : t.value;
    this.props.changeTabState({
      ...this.props.state,
      [field]: value,
    });
  }

  filteredSpells = () => {
    const query = _.lowerCase(this.props.state.query);
    const { searchDesc } = this.props.state;
    if (query.length < 3) return [];
    return _.filter(this.props.spells, (spell) => _.lowerCase(spell.name).indexOf(query) !== -1
      || (searchDesc && query.length > 2
          && _.lowerCase(spell.description).indexOf(query) !== -1));
  }

  groupedSpells = () => ({ all: this.filteredSpells() })

  groupedSpellHeadings = () => [['all', 'Search results:']]

  renderMiscChoices = () => (
    <div>
      <label>
        Search descriptions too:
        <input
          type="checkbox"
          checked={this.props.state.searchDesc}
          onChange={this.handleChange('searchDesc')}
        />
      </label>
    </div>
  )

  renderTextSearch = () => (
    <div>
      <label>
        Search spells by name:
        <input
          type="text"
          value={this.props.state.query}
          onChange={this.handleChange('query')}
        />
      </label>
      <br />
    </div>
  )

  render = () => {
    if (!this.props.state) return null;
    const searchShare = `${window.location.origin}?spell=${encodeURIComponent(this.props.state.query)}`;

    return (
      <div>
        {this.renderTextSearch()}
        {this.renderMiscChoices()}
        <SpellViewer
          groupedSpells={this.groupedSpells()}
          groupedSpellHeadings={this.groupedSpellHeadings()}
          expandedSpell={0}
          onExpandSpell={() => null}
          updateSpell={this.props.updateSpell}
          authenticated={this.props.authenticated}
        />
        {this.props.state.query ? (
          <p>
            Share this search:&nbsp;
            <a href={searchShare}>{decodeURIComponent(searchShare)}</a>
          </p>
        ) : null}
      </div>
    );
  }
}

// eslint-disable-next-line immutable/no-mutation
SpellTextSearch.propTypes = ({
  spells: PropTypes.arrayOf(PropTypes.object),
  authenticated: PropTypes.bool,
  updateSpell: PropTypes.func,
  changeTabState: PropTypes.func,
  state: PropTypes.shape({
    query: PropTypes.string,
    searchDesc: PropTypes.bool,
  }),
});

export default SpellTextSearch;
