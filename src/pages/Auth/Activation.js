import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { gql, useMutation } from '@apollo/client'
import { Redirect } from 'react-router-dom'
import { useAuthDispatch } from 'components/Auth/context'
import Loading from 'components/partials/Loading'
import Alert from 'components/partials/Alert'
import { authFields } from 'graphql/fragments'


const ACTIVATION = gql`
  mutation activationMutation($code: String!) {
    activateUser(code: $code) {
      ...AuthFields
    }
  }
  ${authFields}
`


function Activation({ match }) {
  const [activate, { error, data }] = useMutation(ACTIVATION)
  const authDispatch = useAuthDispatch()
  const { code } = match.params
  useEffect(() => {
    activate({ variables: { code } })
      .then(({ data: { activateUser } }) => {
        authDispatch({ type: 'login', user: activateUser })
      }).catch(() => {})
  }, [code, activate, authDispatch])
  if (error) return <Alert type="danger">Could not find activation code or it&apos;s already been used.</Alert>
  if (!data || !data.activateUser) return <Loading />

  const to = {
    pathname: '/',
    state: { flashMessage: 'Your account has been activated and you have been logged in.' },
  }
  return <Redirect to={to} />
}
Activation.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      code: PropTypes.string.isRequired,
    }),
  }).isRequired,
}


export default Activation
