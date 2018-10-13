import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router } from 'react-router-dom'
import apollo from './utils/apollo'
import Auth from './components/Auth'
import Routes from './Routes'
import Header from './components/Header'
import FlashMessages from './components/FlashMessages'
import './scss/App.scss'

function App () {
  return (
    <ApolloProvider client={apollo.client}>
      <Auth>
        <Router>
          <div>
            <Header />
            <div className='container'>
              <FlashMessages />
              <Routes />
            </div>
          </div>
        </Router>
      </Auth>
    </ApolloProvider>
  )
}

export default App
