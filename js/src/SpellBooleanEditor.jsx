import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

class SpellBooleanEditor extends Component {
  // eslint-disable-next-line immutable/no-mutation, no-unused-vars
  handleChange = (spell, key) => (_e) => {
    this.props.updateSpell(spell.id, { [key]: !spell[key] });
  }

  render = () => (
    <div>
      <ul>
        {this.props.spells.map((spell) => (
          <div key={spell.id} className="row">
            <div className="col-xs-6" style={{ textAlign: 'right' }}>
              <strong style={{ paddingRight: '1em' }}>{spell.name}</strong>
                &nbsp;R:&nbsp;
              <input
                type="checkbox"
                style={{ paddingLeft: '2em' }}
                checked={spell.ritual}
                onChange={this.handleChange(spell, 'ritual')}
              />
                &nbsp;C:&nbsp;
              <input
                type="checkbox"
                style={{ paddingLeft: '2em' }}
                checked={spell.concentration}
                onChange={this.handleChange(spell, 'concentration')}
              />
            </div>
          </div>
        ))}
      </ul>
    </div>
  )
}

// eslint-disable-next-line immutable/no-mutation
SpellBooleanEditor.propTypes = ({
  spells: PropTypes.arrayOf(PropTypes.object),
  updateSpell: PropTypes.func,
});

export default SpellBooleanEditor;
