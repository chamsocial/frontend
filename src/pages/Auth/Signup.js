import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import { Redirect, Link } from 'react-router-dom'
import Button from 'components/partials/Button'
import Alert from 'components/partials/Alert'


const signupMutation = gql`
  mutation signupMutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      success
      error {
        message
      }
    }
  }
`


function Signup() {
  const [state, setState] = useState({ username: '', email: '', password: '' })
  const [createUser, { loading, error, data }] = useMutation(signupMutation)

  function submitUser(evt) {
    evt.preventDefault()
    createUser({ variables: state }).catch(() => {})
  }

  function onChange(evt) {
    const { value, id } = evt.target
    setState(currState => ({ ...currState, [id]: value }))
  }

  // Redirect the user home on success
  if (data?.createUser?.success) {
    return (
      <Redirect
        to={{
          pathname: '/',
          state: {
            flashMessage: `We've sent an activation email to ${state.email}, please verify your email with the link in the email to login.`,
          },
        }}
      />
    )
  }

  return (
    <form className="login-formrrow-form box" onSubmit={submitUser}>
      <h1>Signup</h1>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          className="input"
          id="username"
          value={state.username}
          onChange={onChange}
          minLength="3"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          className="input"
          type="email"
          id="email"
          value={state.email}
          onChange={onChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          className="input"
          type="password"
          id="password"
          value={state.password}
          onChange={onChange}
          required
          minLength="6"
        />
      </div>
      {!!data?.createUser?.error?.message && <Alert type="danger">{data.createUser.error.message}</Alert>}
      {!!error && <Alert type="danger">Something unexpected went wrong please try again!</Alert>}
      <div className="form-group">
        <Button loading={loading} type="submit">Give me access, please.</Button>
        {' '}or <Link to="/login">Login</Link>
      </div>
    </form>
  )
}


export default Signup
