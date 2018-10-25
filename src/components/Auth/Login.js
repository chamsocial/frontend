import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import Button from '../partials/Button'
import Alert from '../partials/Alert'
import { withAuth } from './AuthContext'
import './Login.css'

export class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      redirectToReferrer: false,
      message: false,
      isLoading: false,
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.setUsername = this.setUsername.bind(this)
    this.setPassword = this.setPassword.bind(this)
  }

  onSubmit(e) {
    e.preventDefault()
    this.setState({ isLoading: true })
    const { login, auth } = this.props
    const { username, password } = this.state
    const user = { username, password }
    login(user)
      .then(resp => {
        auth.setUser(resp.data.login)
        this.setState({ isLoading: false, redirectToReferrer: true })
      })
      .catch(err => {
        console.log('Login error', err) // eslint-disable-line
        this.setState({ isLoading: false, message: 'Invalid username/email or password' })
      })
  }

  setUsername(e) {
    const username = e.target.value
    this.setState(() => ({ username }))
  }

  setPassword(e) {
    const password = e.target.value
    this.setState(() => ({ password }))
  }

  render() {
    const { message, username, password } = this.state
    const { location } = this.props
    const { from } = location.state || { from: { pathname: '/' } }
    const { redirectToReferrer, isLoading } = this.state
    if (redirectToReferrer) return <Redirect to={from} />

    const isRedirect = location.state && location.state.from
    let redirectMessage = null
    if (isRedirect) {
      redirectMessage = <Alert>Please login to read the post.</Alert>
    }

    let messageComponent = null
    if (message) {
      messageComponent = <Alert type="warn">{message}</Alert>
    }

    return (
      <form onSubmit={this.onSubmit} className="login-form">
        {redirectMessage}
        {messageComponent}
        <div className="form-group">
          <label htmlFor="username">Username or email</label>
          <input value={username} onChange={this.setUsername} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" value={password} onChange={this.setPassword} required />
        </div>
        <div className="form-group">
          <Button loading={isLoading} loadingText="Logging in...">Login</Button>
        </div>
      </form>
    )
  }
}
LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.any,
  }).isRequired,
  auth: PropTypes.shape({
    setUser: PropTypes.func.isRequired,
  }).isRequired,
}

const LOGIN = gql`
  mutation LoginMutation($username: String! $password: String!) {
    login(username: $username, password: $password) {
      id
      username
    }
  }
`

const Login = graphql(LOGIN, {
  props: ({ mutate }) => ({
    login: authValues => mutate({ variables: authValues }),
  }),
})(withAuth(LoginForm))

export default Login
