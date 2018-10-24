import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { AuthContext } from './AuthContext'

const AUTH = gql`query authQuery {
  me {
    id
    username
  }
}`

const Auth = ({ children }) => (
  <Query query={AUTH}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...'
      if (error) return 'Error!'
      return (
        <AuthContext user={data.me}>
          {children}
        </AuthContext>
      )
    }}
  </Query>
)
Auth.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Auth
