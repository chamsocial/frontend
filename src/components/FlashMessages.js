import React from 'react'
import { withRouter } from 'react-router-dom'

function FlashMessages ({ location }) {
  if (location.state && location.state.flashMessage) {
    return <div className='alert'>{location.state.flashMessage}</div>
  }
  return null
}

export default withRouter(FlashMessages)
