import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Form, Text } from 'react-form'
import './Login.css'

export class Signup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      redirect: false
    }
  }

  // https://github.com/tannerlinsley/react-form/issues/25
  isUnique (field, getValue) {
    console.log(getValue(field))
  }

  render () {
    const { redirectToReferrer } = this.state
    if (redirectToReferrer || this.props.user) return <Redirect to='/' />

    return <Form
      onSubmit={(values) => { console.log('Success!', values) }}
      validate={({ username, email }) => {
        return {
          username: !username ? 'A username is required' : undefined,
          email: !email ? 'An email is required' : undefined
        }
      }}
    >
      {({ submitForm, getValue }) => {
        return (
          <form className='login-form' onSubmit={submitForm}>
            <h1>Signup</h1>
            <div className='form-group'>
              <label htmlFor='username'>Username</label>
              <Text field='username' id='username' onBlur={this.isUnique.bind(this, 'username', getValue)} />
            </div>
            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <Text type='email' field='email' id='email' />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <Text type='password' field='password' id='password' />
            </div>
            <div className='form-group'>
              <button className='btn' type='submit'>Give me access, please.</button>
            </div>
          </form>
        )
      }}
    </Form>
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
)(Signup)
