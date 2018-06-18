import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

import './styles/shared.css';


if (process.env.NODE_ENV !== 'production') {
  const {whyDidYouUpdate} = require('why-did-you-update')
  whyDidYouUpdate(React)
}

const render = (Component) => {
  ReactDOM.render(
    <Component />,
    document.getElementById("root")
  )
}
render(App)

if (module.hot) {
  module.hot.accept('./components/App', () => {
    render(require('./components/App').default)
  })
}

registerServiceWorker()