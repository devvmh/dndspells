import React, { Component, PropTypes } from 'react'
import SpellAssigner from './SpellAssigner'
import SpellFilterer from './SpellFilterer'
import SpellTextSearch from './SpellTextSearch'
import SpellBooleanEditor from './SpellBooleanEditor'
import SavedSpellbook from './SavedSpellbook'
import { getQueryParamByName } from './util'
import _ from 'lodash'

const STATE_VERSION = 3
const API = '/api'
const tabs = {
  1: {
    name: 'Filter and group spells',
    TabComponent: SpellFilterer,
    needs_auth: false
  },
  2: {
    name: 'Search spells',
    TabComponent: SpellTextSearch,
    needs_auth: false
  },
  3: {
    name: 'Edit class assignments',
    TabComponent: SpellAssigner,
    needs_auth: true
  },
  4: {
    name: 'Edit true/false values',
    TabComponent: SpellBooleanEditor,
    needs_auth: true
  },
  5: {
    name: 'Saved Spellbook',
    TabComponent: SavedSpellbook,
    needs_auth: false
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
    Object.assign(newState, this.handleQueryParams(newState))
    this.lsSetState(newState)
    this.checkAuthentication()
  }

  lsSetState = state => {
    localStorage.setItem('state', JSON.stringify(_.omit(state, ['spells'])))
    this.setState(state)
  }

  handleQueryParams = state => {
    const spellName = getQueryParamByName('spell')
    if (spellName) {
      state.tabIndex = 2 // search spells
      state.tabState[2].query = spellName
    }

    return state
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

  getCookie = key => {
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i += 1) {
        const cookie = _.trim(cookies[i]);
        if (cookie.substring(0, key.length + 1) == (key + '=')) {
          return decodeURIComponent(cookie.substring(key.length + 1));
        }
      }
    }
    return null;
  }

  checkAuthentication = () => {
    const self = this
    window.fetch = window.fetch || function() { return; } /* hack for safari */
    fetch(`${API}/spells/1/`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: {
        'X-CSRFToken': this.getCookie('csrftoken'),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: 'Aid' })
    }).then(response => {
      const newState = self.state
      if (response.ok) {
        newState.authenticated = true
      } else {
        newState.authenticated = false
        if (tabs[newState.tabIndex].needs_auth) {
          newState.tabIndex = 1
        }
      }
      self.lsSetState(newState)
    })
  }
  
  handleUpdateSpell = (id, data) => {
    const self = this
    window.fetch = window.fetch || function() { return; } /* hack for safari */
    fetch(`${API}/spells/${id}/`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: {
        'X-CSRFToken': this.getCookie('csrftoken'),
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
          onClick={this.checkAuthentication}
        >
          .
        </span>
        <TabComponent spells={this.state.spells}
          classes={classes}
          authenticated={this.state.authenticated}
          updateSpell={this.handleUpdateSpell}
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
