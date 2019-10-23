import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import Loading from 'components/partials/Loading'
import { AuthProvider } from './context'


const AUTH = gql`query authQuery {
  me {
    id
    username
    slug
    bouncing
  }
}`


function Auth({ children }) {
  const { loading, error, data } = useQuery(AUTH)
  if (loading || error) return <Loading error={error} />
  return (
    <AuthProvider user={data.me}>
      {children}
    </AuthProvider>
  )
}
Auth.propTypes = {
  children: PropTypes.node.isRequired,
}


export default Auth
