import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routes from './Routes'
import Header from './components/Header'
import Footer from './components/Footer'
import FlashMessages from './components/FlashMessages'
import { useAuthState } from './components/Auth/context'

const Router = () => {
  const { user } = useAuthState()

  return (
    <BrowserRouter>
      <Header />
      <div className="container">
        {user && user.bouncing && <div className="alert alert--danger">Your email was bouncing. Wrong?</div>}
        <FlashMessages />
        <Routes />
      </div>
      <Footer />
    </BrowserRouter>
  )
}

export default Router
