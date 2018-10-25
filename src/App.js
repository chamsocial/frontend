import React from 'react'
import { ApolloProvider } from 'react-apollo'
import apollo from './utils/apollo'
import Auth from './components/Auth'
import Router from './Router'
import './scss/App.scss'

function App() {
  return (
    <ApolloProvider client={apollo.client}>
      <Auth>
        <div>
          <Router />
        </div>
      </Auth>
    </ApolloProvider>
  )
}

export default App
