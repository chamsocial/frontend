import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTimes, faTimesCircle, faTrashAlt, faComment,
} from '@fortawesome/free-solid-svg-icons'
import apollo from './utils/apollo'
import Auth from './components/Auth'
import Router from './Router'

library.add(faTimes, faTimesCircle, faTrashAlt, faComment)

// Prevent file drag'n drop to load file in the browser
window.addEventListener('dragover', e => e.preventDefault(), false)
window.addEventListener('drop', e => e.preventDefault(), false)


function App() {
  return (
    <ApolloProvider client={apollo.client}>
      <Auth>
        <Router />
      </Auth>
    </ApolloProvider>
  )
}


export default App
