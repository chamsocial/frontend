import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Redirect } from 'react-router-dom'
import { withAuth } from './AuthContext'
import Loading from '../partials/Loading'
import Alert from '../partials/Alert'

export class Activation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      error: false,
    }
  }

  componentDidMount() {
    const { code, activate, auth } = this.props
    activate({ code })
      .then(({ data: { activateUser } }) => {
        console.log('Yes', activateUser)
        auth.setUser(activateUser)
        this.setState({ isLoading: false, error: false })
      })
      .catch(e => {
        console.log('E', e)
        this.setState({ isLoading: false, error: true })
      })
  }

  render() {
    const { isLoading, error } = this.state
    if (isLoading) return <Loading />
    if (error) return <Alert type="danger">Could not find activation code or it&apos;s already been used.</Alert>
    const to = {
      pathname: '/',
      state: { flashMessage: 'Your account has been activated and you have been logged in.' },
    }
    return <Redirect to={to} />
  }
}

Activation.propTypes = {
  code: PropTypes.string.isRequired,
  activate: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    setUser: PropTypes.func.isRequired,
  }).isRequired,
}

const activationMutation = gql`
  mutation activationMutation($code: String!) {
    activateUser(code: $code) {
      id
      username
      slug
      email
    }
  }
`

export default graphql(activationMutation, {
  props: ({ mutate }) => ({
    activate: variables => mutate({ variables }),
  }),
})(withAuth(Activation))
