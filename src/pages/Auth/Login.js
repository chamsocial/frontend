import React, { Component } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { Link } from 'react-router-dom'
import Button from '../../components/partials/Button'
import Alert from '../../components/partials/Alert'
import { withAuth } from '../../components/Auth/AuthContext'


const { REACT_APP_DEV_USER = '', REACT_APP_DEV_PASS = '' } = process.env


export class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: REACT_APP_DEV_USER || '',
      password: REACT_APP_DEV_PASS || '',
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
    const {
      login, auth, history, location,
    } = this.props
    const { username, password } = this.state

    login({ username, password })
      .then(resp => {
        auth.setUser(resp.data.login)
        const { from } = location.state || { from: { pathname: '/' } }
        history.push(from.pathname, from.state)
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
    const { isLoading } = this.state

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
      <form onSubmit={this.onSubmit} className="narrow-form box">
        <h1>Login</h1>
        {redirectMessage}
        {messageComponent}
        <div className="form-group">
          <label htmlFor="username">Username or email</label>
          <input className="input" value={username} onChange={this.setUsername} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input className="input" type="password" value={password} onChange={this.setPassword} required />
        </div>
        <div className="form-group">
          <Button type="submit" loading={isLoading} loadingText="Logging in...">Login</Button>
          {' '}or <Link to="/signup">Signup</Link>
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
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  auth: PropTypes.shape({
    setUser: PropTypes.func.isRequired,
  }).isRequired,
}

const LOGIN = gql`
  mutation LoginMutation($username: String! $password: String!) {
    login(username: $username, password: $password) {
      id
      slug
      username
    }
  }
`

const Login = graphql(LOGIN, {
  props: ({ mutate }) => ({
    login: authValues => mutate({ variables: authValues, refetchQueries: ['authQuery'] }),
  }),
})(withAuth(LoginForm))

export default Login
