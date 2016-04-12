import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

const EXPAND_NONE = -1
const EXPAND_ALL = 0

class SpellViewer extends Component {
  renderSpellDescription = spell => {
    if (this.props.expandedSpell === EXPAND_ALL ||
        this.props.expandedSpell === spell.id) {
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
    const spells = this.props.groupedSpells
    const { baseUrl } = this.props
    return (
      <table className="table table-striped">
        <thead><tr>
          <th>Spell</th>
          <th>Classes</th>
          <th>Level</th>
          <th>School</th>
        </tr></thead>
        {this.props.groupedSpellHeadings.map(([key, heading]) => {
          const spellGroup = _.get(spells, key)
          if (spellGroup === undefined) return null

          return (
            <tbody key={key}>
              <tr><th colSpan="4">{heading}</th></tr>
              {_.flatMap(spellGroup, spell => {
                return [(
                  <tr key={`${spell.id}-row1`}
                    className={`spell-${spell.id}`}
                    onClick={this.props.onExpandSpell(spell.id)}
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
                    onClick={this.props.onExpandSpell(spell.id)}
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
    )
  }
}

SpellViewer.propTypes = ({
  groupedSpells: PropTypes.objectOf(PropTypes.array),
  groupedSpellHeadings: PropTypes.array, // [key, heading]
  onExpandSpell: PropTypes.func,
  authenticated: PropTypes.bool,
  baseUrl: PropTypes.string
})

export default SpellViewer
