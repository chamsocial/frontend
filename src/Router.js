import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routes from './Routes'
import Header from './components/Header'
import Footer from './components/Footer'
import FlashMessages from './components/FlashMessages'


function Router() {
  return (
    <BrowserRouter>
      <Header />
      <h3 style={{ textAlign: 'center', color: 'red' }}>Beta test site data will be erased!</h3>
      <div className="container">
        <FlashMessages />
        <Routes />
      </div>
      <Footer />
    </BrowserRouter>
  )
}


export default Router
