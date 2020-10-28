import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

class SpellDescription extends Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line immutable/no-mutation
    this.state = {
      editing: false,
      description: this.props.spell.description,
    };
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromProps(nextProps, _prevState) {
    return {
      description: nextProps.spell.description,
    };
  }

  startEditing = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({ editing: true });
  }

  stopEditing = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.updateSpell(this.props.spell.id, {
      description: this.state.description,
    });
    this.setState({ editing: false });
  }

  handleChange = (field) => (e) => {
    this.setState({
      [field]: e.target.value,
    });
  }

  renderDescription = () => {
    const html = this.props.authenticated && this.state.editing
      ? ''
      : this.props.spell.description;
    const innerHTML = { __html: html };
    // eslint-disable-next-line react/no-danger
    return <p dangerouslySetInnerHTML={innerHTML} />;
  }

  renderEditor = () => {
    if (this.props.authenticated && this.state.editing) {
      return (
        <textarea
          value={this.state.description}
          onChange={this.handleChange('description')}
          rows={5}
          cols={80}
          style={{ maxWidth: '100%' }}
        />
      );
    }
    return null;
  }

  renderEditOptions = () => {
    if (!this.props.authenticated) {
      return null;
    }
    if (this.state.editing) {
      return <button type="button" className="btn btn-link" onClick={this.stopEditing}>stop editing</button>;
    }
    return <button type="button" className="btn btn-link" onClick={this.startEditing}>edit</button>;
  }

  // strip html tags - won't handle attributes though
  abbreviate = (desc) => desc.substring(0, 90).replace(/<\/?\w+>/g, '')

  render = () => {
    const { spell, expanded } = this.props;
    if (!expanded) {
      return (
        <div>
          <p>
            {`${this.abbreviate(spell.description)}...`}
          </p>
        </div>
      );
    }

    const concentration = spell.concentration ? 'Concentration, ' : '';
    return (
      <div>
        <p>
          <strong>Casting</strong>
          :
          {spell.casting_time}
          <br />
          <strong>Range</strong>
          :
          {spell.range}
          <br />
          <strong>Components</strong>
          :
          {spell.components}
          <br />
          <strong>Duration</strong>
          :
          {concentration}
          {' '}
          {spell.duration}
        </p>
        <div>{this.renderDescription()}</div>
        {this.renderEditor()}
        {
          // this.renderEditOptions() // disabled
        }
      </div>
    );
  }
}

// eslint-disable-next-line immutable/no-mutation
SpellDescription.propTypes = {
  spell: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  expanded: PropTypes.bool,
  authenticated: PropTypes.bool,
  updateSpell: PropTypes.func,
};

export default SpellDescription;
