import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import Button from '../partials/Button'
import Alert from '../partials/Alert'
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
    const { login } = this.props
    const { username, password } = this.state
    const user = { username, password }
    login(user)
      .then(resp => {
        console.log(resp.data.login)
        // this.setState({ redirectToReferrer: true })
        this.setState({ isLoading: false, message: 'Logged in' })
      })
      .catch(err => {
        console.log(err)
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
})(LoginForm)

export default Login
