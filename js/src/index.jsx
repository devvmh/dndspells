/* global window, document */

import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';

ReactDOM.render(
  <Root classes={window.classes} />,
  document.getElementById('root'),
);
