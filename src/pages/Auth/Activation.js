import React, { useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Navigate, useParams } from 'react-router-dom'
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


function Activation() {
  const { code } = useParams()
  const [activate, { error, data }] = useMutation(ACTIVATION)
  const authDispatch = useAuthDispatch()
  useEffect(() => {
    activate({ variables: { code } })
      .then(({ data: { activateUser } }) => {
        authDispatch({ type: 'login', user: activateUser })
      }).catch(() => {})
  }, [code, activate, authDispatch])
  if (error) return <Alert type="danger">Could not find activation code or it&apos;s already been used.</Alert>
  if (!data || !data.activateUser) return <Loading />

  const toState = { flashMessage: 'Your account has been activated and you have been logged in.' }
  return <Navigate to="/" state={toState} />
}


export default Activation
