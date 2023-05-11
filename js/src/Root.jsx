/* global document, window */

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import _ from 'lodash';
import SavedSpellbook from './SavedSpellbook';
import SpellAssigner from './SpellAssigner';
import SpellFilterer from './SpellFilterer';
import SpellTextSearch from './SpellTextSearch';
import SpellBooleanEditor from './SpellBooleanEditor';
import SourceSelector from './SourceSelector';
import { getQueryParamByName } from './util';
import 'whatwg-fetch';

const STATE_VERSION = 3;
const API = '/api';
const tabs = {
  1: {
    name: 'Filter and group spells',
    TabComponent: SpellFilterer,
    needs_auth: false,
  },
  2: {
    name: 'Search spells',
    TabComponent: SpellTextSearch,
    needs_auth: false,
  },
  3: {
    name: 'Edit class assignments',
    TabComponent: SpellAssigner,
    needs_auth: true,
  },
  4: {
    name: 'Edit true/false values',
    TabComponent: SpellBooleanEditor,
    needs_auth: true,
  },
  5: {
    name: 'Saved Spellbook',
    TabComponent: SavedSpellbook,
    needs_auth: false,
  },
};

const DEFAULT_STATE = {
  STATE_VERSION,
  spells: [],
  sources: ['phb'],
  tabIndex: 1,
  authenticated: false,
  tabState: {},
};

class Root extends Component {
  constructor(props) {
    super(props);
    const savedState = JSON.parse(window.localStorage.getItem('state'));
    const newState = (
      savedState && savedState.STATE_VERSION === STATE_VERSION
        ? savedState
        : DEFAULT_STATE
    );
    Object.assign(newState, this.handleQueryParams(newState));
    // eslint-disable-next-line immutable/no-mutation
    this.state = { spells: [], ...newState };
  }

  componentDidMount = () => {
    this.fetchAllSpells();
    this.checkAuthentication();
  }

  lsSetState = (state) => {
    window.localStorage.setItem('state', JSON.stringify(_.omit(state, ['spells'])));
    this.setState(state);
  }

  handleQueryParams = (state) => {
    const spellName = getQueryParamByName('spell');
    const newState = { ...state };
    if (spellName) {
      /* eslint-disable immutable/no-mutation */
      newState.tabIndex = 2; // search spells
      newState.tabState[2].query = spellName;
      /* eslint-enable immutable/no-mutation */
    }

    return newState;
  }

  handleTabChange = (tabIndex) => () => {
    if (!(tabIndex.toString() in tabs)) {
      return;
    }
    if (tabs[tabIndex].needs_auth && !this.state.authenticated) {
      return;
    }
    this.lsSetState({ ...this.state, tabIndex });
  }

  handleChangeTabState = (tabIndex) => (newState) => {
    this.lsSetState({
      ...this.state,
      tabState: {
        ...this.state.tabState,
        [tabIndex]: newState,
      },
    });
  }

  getCookie = (key) => {
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i += 1) {
        const cookie = _.trim(cookies[i]);
        if (cookie.substring(0, key.length + 1) === (`${key}=`)) {
          return decodeURIComponent(cookie.substring(key.length + 1));
        }
      }
    }
    return null;
  }

  checkAuthentication = () => {
    window.fetch(`${API}/spells/1/`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: {
        'X-CSRFToken': this.getCookie('csrftoken'),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'Aid' }),
    }).then((response) => {
      const newState = {
        ...this.state,
        authenticated: response.ok,
      };
      if (!response.ok) {
        if (tabs[newState.tabIndex].needs_auth) {
          newState.tabIndex = 1; // eslint-disable-line immutable/no-mutation
        }
      }
      this.lsSetState(newState);
    });
  }

  handleUpdateSources = (sources) => {
    this.lsSetState({ ...this.state, sources });
  }

  handleUpdateSpell = (id, data) => {
    window.fetch(`${API}/spells/${id}/`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: {
        'X-CSRFToken': this.getCookie('csrftoken'),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => response.json()).then((payload) => {
      const newState = {
        ...this.state,
        spells: this.state.spells.map((spell) => {
          if (spell.id === payload.id) {
            return payload;
          }
          return spell;
        }),
      };
      this.lsSetState(newState);
    }, (error) => {
      // TODO should give user-facing error feedback
      // eslint-disable-next-line no-console
      console.error('updateSpell caught an error', error);
    });
  }

  fetchAllSpells = () => {
    window.fetch(`${API}/spells.json`, {
      method: 'GET',
    }).then((response) => response.json()).then((payload) => {
      this.setState((prevState) => ({
        spells: prevState.spells.concat(payload),
      }));
    });
  }

  render = () => {
    const { tabIndex } = this.state;
    const { TabComponent } = tabs[tabIndex];
    const classes = this.props.classes.map((c) => c.name);
    const filteredTabs = this.state.authenticated ? tabs : _.omitBy(tabs, (t) => t.needs_auth);
    return (
      <div>
        {Object.keys(filteredTabs).map((index) => {
          const tab = tabs[index];
          const fontWeight = tabIndex.toString() === index ? 'bold' : 'normal';
          return (
            <button
              type="button"
              onClick={this.handleTabChange(index)}
              key={index}
              className="btn btn-default"
              style={{ fontWeight }}
            >
              {tab.name}
            </button>
          );
        })}
        <button
          type="button"
          style={{ color: 'white', border: 'none', background: 'none' }}
          onClick={this.checkAuthentication}
        >
          .
        </button>

        <SourceSelector
          sources={this.state.sources}
          potentialSources={['phb', 'xge', 'tce', 'kpdm']}
          updateSources={this.handleUpdateSources}
        />

        {this.state.spells.length === 0 ? <p>Loading spells...</p> : (
          <TabComponent
            spells={this.state.spells}
            classes={classes}
            authenticated={this.state.authenticated}
            updateSpell={this.handleUpdateSpell}
            changeTabState={this.handleChangeTabState(tabIndex)}
            sources={this.state.sources}
            state={this.state.tabState[tabIndex]}
          />
        )}
      </div>
    );
  }
}

// eslint-disable-next-line immutable/no-mutation
Root.propTypes = {
  classes: PropTypes.arrayOf(PropTypes.string),
};

export default Root;
