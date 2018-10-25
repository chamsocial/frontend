import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routes from './Routes'
import Header from './components/Header'
import FlashMessages from './components/FlashMessages'

const Router = () => (
  <BrowserRouter>
    <div>
      <Header />
      <div className="container">
        <FlashMessages />
        <Routes />
      </div>
    </div>
  </BrowserRouter>
)

export default Router
