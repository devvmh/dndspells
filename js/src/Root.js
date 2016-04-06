import React, { Component, PropTypes } from 'react'
import SpellAssigner from './SpellAssigner'
import SpellViewer from './SpellViewer'
import _ from 'lodash'

const URL = 'http://localhost:3333/api'

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
    const self = this
    fetch(`${URL}/spells/${id}/`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => {
      return response.json()
    }).then(data => {
      const newState = self.state
      newState.spells = self.state.spells.map(spell => {
        if (spell.id === data.id) {
          return data
        }
        return spell
      })
      self.setState(newState)
    }).catch(error => {
      console.error("updateSpell caught an error")
      console.error(error)
    })
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
