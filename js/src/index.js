import SpellEditor from './SpellEditor'
import React from 'react'
import ReactDOM from 'react-dom'

console.log("starting")
ReactDOM.render(
  <SpellEditor spells={spells} />,
  document.getElementById('spell-editor')
)
console.log("finished")
