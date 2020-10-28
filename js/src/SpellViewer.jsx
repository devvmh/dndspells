import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import _ from 'lodash';
import SpellDescription from './SpellDescription';

export const EXPAND_NONE = -1;
export const EXPAND_ALL = 0;

class SpellViewer extends Component {
  render = () => {
    const spells = this.props.groupedSpells;
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Spell</th>
            <th>Classes</th>
            <th>Level</th>
            <th>School</th>
          </tr>
        </thead>
        {this.props.groupedSpellHeadings.map(([key, heading]) => {
          const spellGroup = _.get(spells, key);
          if (spellGroup === undefined) return null;

          return (
            <tbody key={key}>
              <tr><th colSpan="4">{heading}</th></tr>
              {_.flatMap(spellGroup, (spell) => {
                const expanded = this.props.expandedSpell === EXPAND_ALL
                                 || this.props.expandedSpell === spell.id;
                return [(
                  <tr
                    key={`${spell.id}-row1`}
                    className={`spell-${spell.id}`}
                    onClick={this.props.onExpandSpell(spell.id)}
                  >
                    <td>
                      {!this.props.authenticated ? spell.name : (
                        <a href={`/admin/spells/spell/${spell.id}/`}>
                          {spell.name}
                        </a>
                      )}
                    </td>
                    <td>{spell.classes.join(', ')}</td>
                    <td>{spell.level}</td>
                    <td>
                      {spell.school}
                      {spell.ritual ? ' (ritual)' : ''}
                    </td>
                  </tr>
                ), (
                  <tr
                    key={`${spell.id}-row2`}
                    className={`desc-${spell.id}`}
                    onClick={this.props.onExpandSpell(spell.id)}
                  >
                    <td />
                    <td colSpan="3">
                      <SpellDescription
                        spell={spell}
                        expanded={expanded}
                        authenticated={this.props.authenticated}
                        updateSpell={this.props.updateSpell}
                      />
                    </td>
                  </tr>
                )];
              })}
            </tbody>
          );
        })}
      </table>
    );
  }
}

// eslint-disable-next-line immutable/no-mutation
SpellViewer.propTypes = ({
  authenticated: PropTypes.bool,
  expandedSpell: PropTypes.number,
  groupedSpells: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.objectOf(PropTypes.array)),
    PropTypes.objectOf(PropTypes.array),
  ]),
  groupedSpellHeadings: PropTypes.arrayOf(PropTypes.string), // [key, heading]
  onExpandSpell: PropTypes.func,
  updateSpell: PropTypes.func,
});

export default SpellViewer;
