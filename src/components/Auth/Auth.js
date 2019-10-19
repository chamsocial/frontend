import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import { AuthContext } from './AuthContext'

const AUTH = gql`query authQuery {
  me {
    id
    username
    slug
  }
}`

const Auth = ({ children }) => {
  const { loading, error, data } = useQuery(AUTH)
  if (loading) return 'Loading...'
  if (error) return 'Error!'
  return (
    <AuthContext user={data.me}>
      {children}
    </AuthContext>
  )
}
Auth.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Auth
