import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './Routes'
import Header from './components/Header'
import './App.css'

import { client as apolloClient } from './lib/apollo'
import store from './lib/store'
import './lib/networkInterface'

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
