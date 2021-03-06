import React from 'react'
import PropTypes from 'prop-types'
import { gql, useQuery } from '@apollo/client'
import Loading from 'components/partials/Loading'
import { authFields } from 'graphql/fragments'
import { AuthProvider } from './context'


const AUTH = gql`
  query authQuery {
    me {
      ...AuthFields
    }
  }
  ${authFields}
`


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
