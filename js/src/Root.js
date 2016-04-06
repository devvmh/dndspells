import React, { Component, PropTypes } from 'react'
import SpellAssigner from './SpellAssigner'
import SpellViewer from './SpellViewer'
import _ from 'lodash'

class Root extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabIndex: 1,
      spells: props.spells
    }
  }

  tabs = {
    1: {
      name: "Spell Viewer",
      TabComponent: SpellViewer
    },
    2: {
      name: "Spell Assigner",
      TabComponent: SpellAssigner
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
    const classes = this.props.classes.map(c => c.name)
    return (
      <div>
        {Object.keys(this.tabs).map(index => {
          const tab = this.tabs[index]
          const active = tabIndex === index ? 'btn-primary' : 'btn-default'
          return (
            <a onClick={this.handleTabChange(index)}
              key={index}
              className={`btn ${active}`}
            >
              {tab.name}
            </a>
          )
        })}
        <TabComponent spells={this.state.spells}
          classes={classes}
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
