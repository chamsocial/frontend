import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Redirect } from 'react-router-dom'

export class Activation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      error: false
    }
  }
  componentDidMount () {
    const { code, activate } = this.props
    activate({ code })
      .then(({ data: { activateUser } }) => {
        this.props.login(activateUser.user, activateUser.token)
        this.setState({ isLoading: false })
      })
      .catch(e => {
        this.setState({ isLoading: false, error: true })
      })
  }

  render () {
    if (this.state.isLoading) return <div>Loading...</div>
    if (this.state.error) return <h2>Could not find activation code or it's already been used.</h2>
    const to = {
      pathname: '/',
      state: { flashMessage: `Your account has been activated and you have been logged in.` }
    }
    return <Redirect to={to} />
  }
}

const activationMutation = gql`
  mutation activationMutation($code: String!) {
    activateUser(code: $code) {
      user {
        id
        username
        slug
        email
      }
      token
    }
  }
`

function mapDispatchToProps (dispatch) {
  return {
    login: (user, token) => dispatch({
      type: 'login',
      user,
      token
    })
  }
}

export default graphql(activationMutation, {
  props: ({ mutate, ownProps }) => ({
    activate: (variables) => {
      return mutate({ variables })
    }
  })
})(connect(null, mapDispatchToProps)(Activation))
