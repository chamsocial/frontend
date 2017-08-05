import React from 'react'
import { withRouter } from 'react-router-dom'
import Alert from './partials/Alert'

function FlashMessages ({ location }) {
  if (location.state && location.state.flashMessage) {
    return <Alert>{location.state.flashMessage}</Alert>
  }
  return null
}

export default withRouter(FlashMessages)
