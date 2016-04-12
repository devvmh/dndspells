import React, { Component, PropTypes } from 'react'
import SpellAssigner from './SpellAssigner'
import SpellFilterer from './SpellFilterer'
import SpellTextSearch from './SpellTextSearch'
import _ from 'lodash'

const STATE_VERSION = 3
const BASE_URL = `${window.location.protocol}//${window.location.host}`
const API = `${BASE_URL}/api`
const tabs = {
  1: {
    name: "Filter and group spells",
    TabComponent: SpellFilterer,
    needs_auth: false
  },
  2: {
    name: "Search spells",
    TabComponent: SpellTextSearch,
    needs_auth: false
  },
  3: {
    name: "Spell Assigner",
    TabComponent: SpellAssigner,
    needs_auth: true
  }
}

class Root extends Component {
  constructor(props) {
    super(props)
    this.state = {
      STATE_VERSION,
      spells: this.props.spells,
      tabIndex: 1,
      authenticated: false,
      tabState: {}
    }
  }

  componentWillMount = () => {
    const savedState = JSON.parse(localStorage.getItem('state'))
    const newState = (
      savedState && savedState.STATE_VERSION === STATE_VERSION
        ? savedState
        : this.state
    )
    newState.spells = window.spells
    if (tabs[newState.tabIndex].needs_auth && !newState.authenticated) {
      console.log("adjusting tab index")
      newState.tabIndex = 1
    }
    this.lsSetState(newState)
  }

  lsSetState = state => {
    localStorage.setItem('state', JSON.stringify(_.omit(state, ['spells'])))
    this.setState(state)
  }

  toggleAuthenticated = () => {
    const newState = this.state
    newState.authenticated = !this.state.authenticated
    this.lsSetState(newState)
  }

  handleTabChange = tabIndex => () => {
    if (!(tabIndex.toString() in tabs)) {
      return
    }
    if (tabs[tabIndex].needs_auth && !this.state.authenticated) {
      return
    }
    const newState = this.state
    newState.tabIndex = tabIndex
    this.lsSetState({ ...this.state, tabIndex })
  }

  handleChangeTabState = tabIndex => newState => {
    this.lsSetState({
      ...this.state,
      tabState: {
        ...this.state.tabState,
        [tabIndex]: newState
      }
    })
  }
  
  handleCreateSpell = spell => {
    alert("TODO implement")
  }

  handleUpdateSpell = (id, data) => {
    const self = this
    fetch(`${API}/spells/${id}/`, {
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
      self.lsSetState(newState)
    }).catch(error => {
      console.error("updateSpell caught an error")
      console.error(error)
    })
  }

  handleDeleteSpell = id => {
    alert("TODO implement")
  }

  render = () => {
    const { tabIndex } = this.state
    const { needs_auth, TabComponent } = tabs[tabIndex]
    const classes = this.props.classes.map(c => c.name)
    const filteredTabs = this.state.authenticated ? tabs : _.omitBy(tabs, t => t.needs_auth)
    return (
      <div>
        {Object.keys(filteredTabs).map(index => {
          const tab = tabs[index]
          const fontWeight = tabIndex.toString() === index ? 'bold' : 'normal'
          return (
            <a onClick={this.handleTabChange(index)}
              key={index}
              className="btn btn-default"
              style={{ fontWeight }}
            >
              {tab.name}
            </a>
          )
        })}
        <span style={{ color: 'white' }}
          onClick={this.toggleAuthenticated}
        >
          .
        </span>
        <TabComponent spells={this.state.spells}
          classes={classes}
          authenticated={this.state.authenticated}
          baseUrl={BASE_URL}
          createSpell={this.handleCreateSpell}
          updateSpell={this.handleUpdateSpell}
          deleteSpell={this.handleDeleteSpell}
          changeTabState={this.handleChangeTabState(tabIndex)}
          state={this.state.tabState[tabIndex]}
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
