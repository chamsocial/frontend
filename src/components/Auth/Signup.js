import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Redirect } from 'react-router-dom'
import { Form, Text } from 'react-form'
import Button from '../partials/Button'
import Alert from '../partials/Alert'
import './Login.css'

function reqMinLength(key, value, length = 3) {
  if (!value) return `${key} is required`
  if (value.length < length) return `${key} has to be at least ${length} characters`
  return ''
}

export class SignupForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirectToReferrer: false,
      errors: [],
      isLoading: false,
    }
    this.submitUser = this.submitUser.bind(this)
  }

  submitUser(values) {
    this.setState({ isLoading: true })
    const { signup } = this.props

    signup(values)
      .then(({ data: { createUser } }) => {
        this.setState({
          redirectToReferrer: {
            pathname: '/',
            state: { flashMessage: `We've sent an activation email to ${createUser.email}, please verify your email with the link in the email to login.` },
          },
        })
      })
      .catch(err => {
        const errors = []
        if (err.graphQLErrors) {
          err.graphQLErrors.map(e => {
            if (e.extensions.code !== 'BAD_USER_INPUT') return null
            return e.extensions.exception.errors.map(field => errors.push(field.message))
          })
        }
        if (!errors) errors.push('Could not create the user')
        this.setState({ isLoading: false, errors })
      })
  }

  render() {
    const { redirectToReferrer, errors, isLoading } = this.state
    if (redirectToReferrer) return <Redirect to={redirectToReferrer} />

    let errorMessage = null
    if (errors.length) {
      errorMessage = (
        <Alert type="warn">
          { /* eslint-disable-next-line react/no-array-index-key */ }
          {errors.map((e, i) => <div key={i}>{e}</div>)}
        </Alert>
      )
    }
    return (
      <Form
        onSubmit={this.submitUser}
        validate={({ username, email, password }) => ({
          username: reqMinLength('Username', username),
          email: !email ? 'Email is required' : undefined,
          password: reqMinLength('Password', password, 6)
        })}
      >
        {({ submitForm }) => (
          <form className="login-form" onSubmit={submitForm}>
            <h1>Signup</h1>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Text field="username" id="username" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Text type="email" field="email" id="email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Text type="password" field="password" id="password" />
            </div>
            {errorMessage}
            <div className="form-group">
              <Button loading={isLoading} type="submit">Give me access, please.</Button>
            </div>
          </form>
        )}
      </Form>
    )
  }
}
SignupForm.propTypes = {
  signup: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.any,
  }).isRequired,
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

const Signup = graphql(signupMutation, {
  props: ({ mutate }) => ({
    signup: variables => mutate({ variables }),
  }),
})(SignupForm)

export default Signup
