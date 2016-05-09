import React, { PropTypes, Component } from 'react'
import SpellFilterer from './SpellFilterer'

class MySpellBook extends Component {
  componentDidMount = () => {
    this.checkState(this.props)
  }

  componentWillReceiveProps = nextProps => {
    this.checkState(nextProps)
  }

  defaultTabState = {
    spellbook: [],
    filtererState: null
  }

  checkState = props => {
    if (!props.state) {
      this.props.changeTabState(this.defaultTabState)
    }
  }

  handleChangeFiltererState = filtererState => {
    this.props.changeTabState({ filtererState })
  }

  render = () => {
    if (!this.props.state) {
      return <p>Loading...</p>
    }
    return (
      <div>
        <p>Cool this is our special component</p>
        <SpellFilterer spells={spells}
          classes={this.props.classes}
          authenticated={this.props.authenticated}
          updateSpell={this.props.updateSpell}
          changeTabState={this.handleChangeFiltererState}
          state={this.props.state.filtererState}
        />
      </div>
    )
  }
}

MySpellBook.propTypes = {
  spells: PropTypes.arrayOf(PropTypes.object),
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
        school: PropTypes.string
      }),
      checkboxes: PropTypes.shape({
        groupByLevel: PropTypes.bool,
        groupBySchool: PropTypes.bool,
        showFullDescriptions: PropTypes.bool,
        ritualOnly: PropTypes.bool
      }),
      expandedSpell: PropTypes.number
    })
  })
}

export default MySpellBook
