import React from 'react'
import { withRouter } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client'
import { useAuthState, useAuthDispatch } from './Auth/context'
import Alert from './partials/Alert'


const UNSET_BOUNCE = gql`mutation authQuery {
  unbounceUser {
    id
    bouncing
  }
}`


function FlashMessages({ location }) {
  const { user } = useAuthState()
  const authDispatch = useAuthDispatch()
  const [unsetBounce, { loading, error }] = useMutation(UNSET_BOUNCE)

  function onClick() {
    unsetBounce()
      .then(() => {
        const newUser = { ...user, bouncing: false }
        authDispatch({ type: 'login', user: newUser })
      })
  }

  if (location.state && location.state.flashMessage) {
    return <Alert>{location.state.flashMessage}</Alert>
  }
  if (user && user.bouncing) {
    return (
      <div className="alert alert--danger">
        Your email was bouncing so we have stopped sending emails. Wrong?{' '}
        <button className="btn btn--small" type="button" disabled={loading} onClick={onClick}>Reactivate</button>
        {error && ' - Something went wrong!'}
      </div>
    )
  }
  return null
}

export default withRouter(FlashMessages)
