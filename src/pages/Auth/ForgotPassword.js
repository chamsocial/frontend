import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import { Link, Redirect } from 'react-router-dom'
import Button from '../../components/partials/Button'
import Alert from '../../components/partials/Alert'


const FORGOT_PASSWORD = gql`
  mutation forgotPasswordMutation($username: String!) {
    forgotPassword(username: $username)
  }
`

function ForgotPassword() {
  const [forgotPassword, { loading, error, data }] = useMutation(FORGOT_PASSWORD)
  const [username, setUsername] = useState('')

  if (data && data.forgotPassword) {
    return <Redirect to={{ pathname: '/', state: { flashMessage: 'Check your email for a reset email.' } }} />
  }

  function onSubmit(evt) {
    evt.preventDefault()
    forgotPassword({ variables: { username } }).catch(() => {})
  }

  return (
    <form onSubmit={onSubmit} className="narrow-form box">
      <h1>Forgot password?</h1>
      <div className="form-group">
        <label htmlFor="username">Username or email</label>
        <input className="input" value={username} onChange={evt => setUsername(evt.target.value)} required />
      </div>

      {error && <Alert type="danger">Something went wrong please try again.</Alert>}
      {data && !data.forgotPassword && (
        <Alert type="danger">Couldn&apos;t find user <strong>{username}</strong>.</Alert>
      )}

      <div className="form-group">
        <Button type="submit" loading={loading} loadingText="Logging in...">Reset password</Button>
        {' '}or <Link to="/ligin">login</Link>
      </div>
    </form>
  )
}


export default ForgotPassword
