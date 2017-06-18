import React, { Component } from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './Routes'
import Header from './components/Header'
import './App.css';

// Reducer
function user(state = { user: false, token: false }, action) {
  switch (action.type) {
    case 'login':
      return { user: action.user, token: action.token }
    case 'logout':
      return { user: false, token: false }
    default:
      return state
  }
}

const preservedState = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : {}

// Store
const store = createStore(user, preservedState)

store.subscribe(() => {
  const userState = store.getState('user')
  localStorage.setItem('user', JSON.stringify(userState))
})

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Header />
            <div className='container'>
              <Routes />
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
