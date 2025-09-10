import React, { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { Navigate, useParams } from 'react-router-dom'
import Loading from 'components/partials/Loading'
import Button from 'components/partials/Button'
import Alert from 'components/partials/Alert'
import { useAuthDispatch } from 'components/Auth/context'
import { authFields } from 'graphql/fragments'


const FORGOT_PASSWORD_TOKEN = gql`
  query resetPasswordQuery($token: String!) {
    resetPassword(token: $token)
  }
`
const RESET_PASSWORD = gql`
  mutation resetPasswordMutation($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      ...AuthFields
    }
  }
  ${authFields}
`

function ResetPassword() {
  const { token } = useParams()
  const { loading, error, data } = useQuery(FORGOT_PASSWORD_TOKEN, { variables: { token } })
  const [resetPassword, mutation] = useMutation(RESET_PASSWORD)
  const [password, setPassword] = useState('')
  const authDispatch = useAuthDispatch()

  if (loading) return <Loading />
  if (error) return <Alert type="danger">Something went wrong, please try again.</Alert>
  if (data.resetPassword === null) return <Alert type="danger">Invalid or expired reset token.</Alert>
  if (mutation.data && mutation.data.resetPassword) {
    return <Navigate to="/" state={{ flashMessage: 'You have been logged in and your password has been reset!' }} />
  }

  function onSubmit(evt) {
    evt.preventDefault()
    if (mutation.loading) return
    resetPassword({ variables: { token, password } })
      .then(resp => {
        authDispatch({ type: 'login', user: resp.data.resetPassword })
      })
      .catch(() => {})
  }

  return (
    <form onSubmit={onSubmit} className="box layout--narrow">
      <h1>Reset password for {data.resetPassword}</h1>
      <div className="form-group">
        <label htmlFor="username">New password</label>
        <input
          className="input"
          type="password"
          value={password}
          minLength="6"
          onChange={evt => setPassword(evt.target.value)}
          required
        />
      </div>

      {(mutation.error || (mutation.data && !mutation.data.resetPassword)) && (
        <Alert type="danger">Something went wrong please try again.</Alert>
      )}

      <div className="form-group">
        <Button type="submit" loading={mutation.loading} loadingText="Logging in...">Reset password</Button>
      </div>
    </form>
  )
}


export default ResetPassword
