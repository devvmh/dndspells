import React, { Component, PropTypes } from 'react'
import SpellEditor from './SpellEditor'
import SpellViewer from './SpellViewer'
import _ from 'lodash'

class Root extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabIndex: 2,
      spells: props.spells
    }
  }

  tabs = {
    1: {
      name: "Spell Editor",
      TabComponent: SpellEditor
    },
    2: {
      name: "Spell Viewer",
      TabComponent: SpellViewer
    }
  }

  handleTabChange = tabIndex => () => {
    if (!(tabIndex.toString() in this.tabs)) {
      return
    }
    this.setState({ tabIndex })
  }
  
  handleCreateSpell = spell => {
    alert("TODO implement")
  }

  handleUpdateSpell = (id, data) => {
    alert("TODO implement")
  }

  handleDeleteSpell = id => {
    alert("TODO implement")
  }

  render() {
    const { tabIndex } = this.state
    const { TabComponent } = this.tabs[tabIndex]
    return (
      <div>
        {Object.keys(this.tabs).map(index => {
          const tab = this.tabs[index]
          return (
            <a onClick={this.handleTabChange(index)}
              key={index}
            >
              {tab.name}
            </a>
          )
        })}
        <TabComponent spells={this.state.spells}
          classes={this.props.classes}
          createSpell={this.handleCreateSpell}
          updateSpell={this.handleUpdateSpell}
          deleteSpell={this.handleDeleteSpell}
        />
      </div>
    )
  }
}

Root.propTypes = {
  spells: PropTypes.array,
  classes: PropTypes.array
}

export default Root
