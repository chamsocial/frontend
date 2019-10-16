import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routes from './Routes'
import Header from './components/Header'
import Footer from './components/Footer'
import FlashMessages from './components/FlashMessages'

const Router = () => (
  <BrowserRouter>
    <>
      <Header />
      <div className="container">
        <FlashMessages />
        <Routes />
        <Footer />
      </div>
    </>
  </BrowserRouter>
)

export default Router
