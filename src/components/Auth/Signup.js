import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Redirect } from 'react-router-dom'
import { Form, Text } from 'react-form'
import Button from '../partials/Button'
import Alert from '../partials/Alert'
import './Login.css'

export class Signup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      redirect: false,
      errors: [],
      isLoading: false
    }
    this.submitUser = this.submitUser.bind(this)
  }

  submitUser (values) {
    this.setState({ isLoading: true })
    this.props.signup(values)
      .then(({ data: { createUser } }) => {
        this.setState({
          redirectToReferrer: {
            pathname: '/',
            state: { flashMessage: `We've sent an activation email to ${createUser.email}, please verify your email with the link in the email to login.` }
          }
        })
      })
      .catch(e => {
        if (e.message.includes('Validation:')) {
          const errors = e.message.split('Validation:')[1]
          if (errors) this.setState({ isLoading: false, errors: errors.split(',') })
        } else {
          this.setState({ isLoading: false, errors: ['Could not create the user'] })
        }
      })
  }

  render () {
    const { redirectToReferrer, errors, isLoading } = this.state
    if (redirectToReferrer || this.props.user) return <Redirect to={redirectToReferrer} />

    let errorMessage = null
    if (errors.length) {
      errorMessage = <Alert type='warn'>
        {errors.map((e, i) => <div key={i}>{e}</div>)}
      </Alert>
    }
    return <Form
      onSubmit={this.submitUser}
      validate={({ username, email, password }) => ({
        username: reqMinLength('Username', username),
        email: !email ? 'Email is required' : undefined,
        password: reqMinLength('Password', password, 6)
      })}
    >
      {({ submitForm, getValue }) => {
        return (
          <form className='login-form' onSubmit={submitForm}>
            <h1>Signup</h1>
            <div className='form-group'>
              <label htmlFor='username'>Username</label>
              <Text field='username' id='username' />
            </div>
            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <Text type='email' field='email' id='email' />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <Text type='password' field='password' id='password' />
            </div>
            {errorMessage}
            <div className='form-group'>
              <Button loading={isLoading} type='submit'>Give me access, please.</Button>
            </div>
          </form>
        )
      }}
    </Form>
  }
}

function reqMinLength (key, value, length = 3) {
  if (!value) return `${key} is required`
  else if (value.length < length) return `${key} has to be at least ${length} characters`
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

const signupMutation = gql`
  mutation signupMutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      id
      username
      slug
      email
    }
  }
`

export default graphql(signupMutation, {
  props: ({ mutate, ownProps }) => ({
    signup: (variables) => {
      return mutate({ variables })
    }
  })
})(connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup))
