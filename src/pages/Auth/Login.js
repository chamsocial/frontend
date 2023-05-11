import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { gql, useMutation } from '@apollo/client'
import { Link, Navigate, useLocation } from 'react-router-dom'
import Button from 'components/partials/Button'
import Alert from 'components/partials/Alert'
import { useAuthState, useAuthDispatch } from 'components/Auth/context'
import { authFields } from 'graphql/fragments'


const { REACT_APP_DEV_USER = '', REACT_APP_DEV_PASS = '' } = process.env
const LOGIN = gql`
  mutation LoginMutation($username: String! $password: String!) {
    login(username: $username, password: $password) {
      ...AuthFields
    }
  }
  ${authFields}
`


function LoginForm() {
  const location = useLocation()
  const [login, { loading, error }] = useMutation(LOGIN)
  const authDispatch = useAuthDispatch()
  const { user } = useAuthState()
  const [username, setUsername] = useState(REACT_APP_DEV_USER)
  const [password, setPassword] = useState(REACT_APP_DEV_PASS)
  const isRedirect = location.state && location.state.from
  const pathname = (isRedirect && location.state.from.pathname) ? location.state.from.pathname : '/'

  if (user) {
    return <Navigate to={pathname} state={{ flashMessage: 'You are now logged in!' }} />
  }

  function onSubmit(evt) {
    evt.preventDefault()
    login({ variables: { username, password }, refetchQueries: ['authQuery'] })
      .then(resp => {
        authDispatch({ type: 'login', user: resp.data.login })
      })
      .catch(() => {})
  }

  return (
    <form onSubmit={onSubmit} className="box layout--narrow">
      <h1>Login</h1>
      {isRedirect && <Alert>Please login to view the page.</Alert>}
      <div className="form-group">
        <label htmlFor="username">Username or email</label>
        <input className="input" value={username} onChange={evt => setUsername(evt.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input className="input" type="password" value={password} onChange={evt => setPassword(evt.target.value)} required />
        <div className="desc text-right">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
      {error && <Alert type="danger">Invalid username/email or password.</Alert>}
      <div className="form-group">
        <Button type="submit" loading={loading} loadingText="Logging in...">Login</Button>
        {' '}or <Link to="/signup">Signup</Link>
      </div>
    </form>
  )
}


export default LoginForm
