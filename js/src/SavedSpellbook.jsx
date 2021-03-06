/* global window */

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import SpellFilterer from './SpellFilterer';

class SavedSpellbook extends Component {
  defaultTabState = {
    spellbook: [],
    filtererState: null,
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

  handleChangeFiltererState = (filtererState) => {
    this.props.changeTabState({
      ...this.props.state,
      filtererState,
    });
  }

  safeSpellbook = () => this.props.state.spellbook.filter((spell) => (
    spell !== null && spell !== undefined
  ))

  handleSpellbookAdd = (e) => {
    const spellbook = this.safeSpellbook();
    // eslint-disable-next-line eqeqeq
    const spell = this.props.spells.filter((item) => item.id == e.target.value).pop();
    if (spell) {
      spellbook.push(spell);
    }
    this.props.changeTabState({ ...this.props.state, spellbook });
  }

  handleSpellbookRemove = (e) => {
    const spellbook = this.safeSpellbook();
    const spellId = parseInt(e.target.value, 10);
    this.props.changeTabState({
      ...this.props.state,
      spellbook: spellbook.filter((spell) => !!spell && spell.id !== spellId),
    });
  }

  handleBackupValueChange = (e) => {
    try {
      const newState = {
        ...this.props.state,
        spellbook: JSON.parse(e.target.value),
      };
      this.props.changeTabState(newState);
    } catch (error) {
      // eslint-disable-next-line no-alert
      window.alert('Backup data was invalid :(');
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  renderSpellbookBackup = () => (
    <div>
      <p>
        Saving your spellbook in a browser is not very reliable. To backup
        your spellbook, copy this text to a file. You can paste it here to
        restore the backup later.
      </p>
      <textarea
        onChange={this.handleBackupValueChange}
        value={JSON.stringify(this.safeSpellbook())}
      />
    </div>
  )

  render = () => {
    if (!this.props.state) {
      return <p>Loading...</p>;
    }
    return (
      <div>
        <select onChange={this.handleSpellbookAdd}>
          <option>-- Add spell --</option>
          {this.props.spells.filter((spell) => (
            // only include spells not in spellbook
            this.props.state.spellbook.indexOf(spell) === -1
          ))
          .sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
          .map((spell) => (
            <option key={spell.id} value={spell.id}>{spell.name}</option>
          ))}
        </select>
        <select onChange={this.handleSpellbookRemove}>
          <option>-- Remove spell --</option>
          {this.safeSpellbook().sort().map((spell) => (
            <option key={spell.id} value={spell.id}>{spell.name}</option>
          ))}
        </select>
        <SpellFilterer
          spells={this.props.state.spellbook || []}
          classes={this.props.classes}
          authenticated={this.props.authenticated}
          updateSpell={this.props.updateSpell}
          changeTabState={this.handleChangeFiltererState}
          sources={this.props.sources}
          state={this.props.state.filtererState}
        />
        {this.renderSpellbookBackup()}
      </div>
    );
  }
}

// eslint-disable-next-line immutable/no-mutation
SavedSpellbook.propTypes = {
  spells: PropTypes.arrayOf(PropTypes.object),
  sources: PropTypes.arrayOf(PropTypes.string),
  classes: PropTypes.arrayOf(PropTypes.string),
  authenticated: PropTypes.bool,
  changeTabState: PropTypes.func,
  updateSpell: PropTypes.func,
  state: PropTypes.shape({
    spellbook: PropTypes.arrayOf(PropTypes.object),
    filtererState: PropTypes.shape({
      filters: PropTypes.shape({
        casterClass: PropTypes.string,
        level: PropTypes.string,
        school: PropTypes.string,
      }),
      checkboxes: PropTypes.shape({
        groupByLevel: PropTypes.bool,
        groupBySchool: PropTypes.bool,
        showFullDescriptions: PropTypes.bool,
        ritualOnly: PropTypes.bool,
      }),
      expandedSpell: PropTypes.number,
    }),
  }),
};

export default SavedSpellbook;
