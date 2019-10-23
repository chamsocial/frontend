import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import { Redirect } from 'react-router-dom'
import { useAuthDispatch } from '../../components/Auth/context'
import Loading from '../../components/partials/Loading'
import Alert from '../../components/partials/Alert'


const ACTIVATION = gql`
  mutation activationMutation($code: String!) {
    activateUser(code: $code) {
      id
      username
      slug
      email
    }
  }
`

function Activation({ match }) {
  const [activate, { error, data }] = useMutation(ACTIVATION)
  const authDispatch = useAuthDispatch()
  const { code } = match.params
  useEffect(() => {
    activate({ variables: { code } })
      .then(({ data: { activateUser } }) => {
        authDispatch({ type: 'login', user: activateUser })
      })
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