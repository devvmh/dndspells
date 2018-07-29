import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
 
class SpellBooleanEditor extends Component {
  handleChange = (spell, key) => e => {
    this.props.updateSpell(spell.id, { [key]: !spell[key] })
  }

  render = () => {
    var self = this
    return (
      <div>
        <ul>
          {this.props.spells.map(spell => (
            <div key={spell.id} className="row">
              <div className="col-xs-6" style={{textAlign: 'right' }}>
                <strong style={{ paddingRight: '1em'}} >{spell.name}</strong>
                &nbsp;R:&nbsp;
                <input type="checkbox"
                  style={{ paddingLeft: '2em' }}
                  checked={spell.ritual}
                  onChange={this.handleChange(spell, 'ritual')}
                />
                &nbsp;C:&nbsp;
                <input type="checkbox"
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
}

SpellBooleanEditor.propTypes = ({
  spells: PropTypes.arrayOf(PropTypes.object),
  sources: PropTypes.arrayOf(PropTypes.string),
  updateSpell: PropTypes.func,
})

export default SpellBooleanEditor
