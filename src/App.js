import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { createStore } from 'redux'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './Routes'
import Header from './components/Header'
import './App.css'

import { client as apolloClient } from './lib/apollo'

// Reducer
function user (state = { user: false, token: false }, action) {
  switch (action.type) {
    case 'login':
      return { user: action.user, token: action.token }
    case 'logout':
      return { user: false, token: false }
    default:
      return state
  }
}

const preservedState = window.localStorage.getItem('user')
  ? JSON.parse(window.localStorage.getItem('user'))
  : {}

// Store
const store = createStore(user, preservedState)

store.subscribe(() => {
  const userState = store.getState('user')
  window.localStorage.setItem('user', JSON.stringify(userState))
})

function App () {
  return (
    <ApolloProvider client={apolloClient} store={store}>
      <Router>
        <div>
          <Header />
          <div className='container'>
            <Routes />
          </div>
        </div>
      </Router>
    </ApolloProvider>
  )
}

export default App
