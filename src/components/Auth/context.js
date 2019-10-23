import React, { useReducer, useContext } from 'react'
import apollo from 'utils/apollo'

const { REACT_APP_API_URL } = process.env
const AuthStateContext = React.createContext()
const AuthDispatchContext = React.createContext()


function logout() {
  fetch(`${REACT_APP_API_URL}/logout`, { credentials: 'include' })
    .then(() => {
      apollo.resetAll()
      window.location = '/'
    })
    .catch(err => {
      console.log('Logout error:', err) // eslint-disable-line
      apollo.resetAll()
      window.location = '/'
    })
}


function authReducer(state, action) {
  switch (action.type) {
    case 'login': {
      return { user: action.user }
    }
    case 'logout': {
      logout()
      return { user: undefined }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function AuthProvider({ children, user }) {
  const [state, dispatch] = useReducer(authReducer, { user })
  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}

function useAuthState() {
  const context = useContext(AuthStateContext)
  if (context === undefined) throw new Error('useAuthState must be used within a AuthProvider')
  return context
}

function useAuthDispatch() {
  const context = useContext(AuthDispatchContext)
  if (context === undefined) throw new Error('useAuthDispatch must be used within a AuthProvider')
  return context
}


export { AuthProvider, useAuthState, useAuthDispatch }
