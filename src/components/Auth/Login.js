import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { request } from '../../utils'
import Button from '../partials/Button'
import './Login.css'
const { REACT_APP_API_URL } = process.env

export class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      redirectToReferrer: false,
      message: false,
      isLoading: false
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.setUsername = this.setUsername.bind(this)
    this.setPassword = this.setPassword.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    this.setState({ isLoading: true })
    const { username, password } = this.state
    const data = { username, password }
    request.post(`${REACT_APP_API_URL}/v2/login`, data)
      .then(res => {
        if (res.user && res.token) {
          this.props.login(res.user, res.token)
          this.setState({ redirectToReferrer: true })
        } else {
          this.setState({ isLoading: false, message: 'Invalid username/email or password' })
        }
      })
      .catch(e => console.error(e))
  }

  setUsername (e) {
    const username = e.target.value
    this.setState(() => ({ username }))
  }

  setPassword (e) {
    const password = e.target.value
    this.setState(() => ({ password }))
  }

  render () {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer, isLoading } = this.state
    if (redirectToReferrer || this.props.user) return <Redirect to={from} />

    const isRedirect = this.props.location.state && this.props.location.state.from
    let redirectMessage = null
    if (isRedirect) {
      redirectMessage = <div className='login-info'>Please login to read the post.</div>
    }

    let message = null
    if (this.state.message) {
      message = <div className='login-info login-warn'>{this.state.message}</div>
    }

    return <form onSubmit={this.onSubmit} className='login-form'>
      {redirectMessage}
      {message}
      <div className='form-group'>
        <label htmlFor='username'>Username or email</label>
        <input value={this.state.username} onChange={this.setUsername} required />
      </div>
      <div className='form-group'>
        <label htmlFor='password'>Password</label>
        <input type='password' value={this.state.password} onChange={this.setPassword} required />
      </div>
      <div className='form-group'>
        <Button loading={isLoading} loadingText='Logging in...'>Login</Button>
      </div>
    </form>
  }
}

// Map Redux state to component props
function mapStateToProps (state) {
  return { user: state.auth.user }
}

// Map Redux actions to component props
function mapDispatchToProps (dispatch) {
  return {
    login: (user, token) => dispatch({
      type: 'login',
      user,
      token
    })
  }
}

// Connected Component
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
