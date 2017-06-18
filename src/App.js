import React, { Component } from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import Routes from './Routes'
import './App.css';

// Reducer
function user(state = { user: false, token: false }, action) {
  switch (action.type) {
    case 'login':
      return { user: action.user, token: action.token }
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
  console.log(userState)
  localStorage.setItem('user', JSON.stringify(userState))
})

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <div className='App-header'>
              <div className='container'>
                <h2 className='logo'>
                <Link to='/'>Chamsocial</Link>
                </h2>
                <Link to='/login'>Login</Link>
              </div>
            </div>
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
