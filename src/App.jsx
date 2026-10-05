import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTimes, faTimesCircle, faTrashAlt, faComment, faSearch, faBookmark,
  faBell, faImage, faMapSigns, faAngleRight, faAngleLeft,
} from '@fortawesome/free-solid-svg-icons'
import apollo from './utils/apollo'
import Auth from './components/Auth'
import Routes from './Routes'
import Header from './components/Header'
import Footer from './components/Footer'
import FlashMessages from './components/FlashMessages'

library.add(
  faTimes,
  faTimesCircle,
  faTrashAlt,
  faComment,
  faSearch,
  faBookmark,
  faBell,
  faImage,
  faMapSigns,
  faAngleRight,
  faAngleLeft,
)

// Prevent file drag'n drop to load file in the browser
window.addEventListener('dragover', e => e.preventDefault(), false)
window.addEventListener('drop', e => e.preventDefault(), false)

if ('ontouchstart' in window || navigator.maxTouchPoints) {
  document.body.classList.add('isToucDevice')
}


function App() {
  return (
    <ApolloProvider client={apollo.client}>
      <Auth>
        <BrowserRouter>
          <Header />
          <div className="container">
            <FlashMessages />
            <Routes />
          </div>
          <Footer />
        </BrowserRouter>
      </Auth>
    </ApolloProvider>
  )
}


export default App
