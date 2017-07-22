import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

import { client as apolloClient } from './apollo'

// Reducer
function auth (state = { user: false, token: false }, action) {
  switch (action.type) {
    case 'login':
      return { user: action.user, token: action.token }
    case 'logout':
      return { user: false, token: false }
    default:
      return state
  }
}

const preservedState = window.localStorage.getItem('appState')
  ? { auth: JSON.parse(window.localStorage.getItem('appState')) }
  : {}

// Store
const storeMiddleware = [applyMiddleware(apolloClient.middleware())]
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  storeMiddleware.push(window.__REDUX_DEVTOOLS_EXTENSION__())
}
export const store = createStore(
  combineReducers({
    auth,
    apollo: apolloClient.reducer()
  }),
  preservedState,
  compose.apply(null, storeMiddleware)
)

store.subscribe(() => {
  const state = store.getState()
  window.localStorage.setItem('appState', JSON.stringify(state.auth))
})

export default store
