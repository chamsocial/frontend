import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import Loading from 'components/partials/Loading'
import Form from './Form'


const EMAIL_SETTINGS = gql`query userEmailSubscriptionsQuery {
  groups {
    id
    title
    subscription
  }
}`

function EmailSettings() {
  const { loading, error, data } = useQuery(EMAIL_SETTINGS)
  if (loading || error) return <Loading error={error} />
  return (
    <div className="box">
      <h1>Email subscriptions</h1>
      <h2>Set your preferred email subscriptions</h2>
      <p>
        Direct subscriptions are sent each message individually as soon as they are posted.
        Daily digests are a single message containing all the posts from the past 24 hours,
        sent around 18:00 each day - use this if you find direct subscriptions too noisy.
      </p>

      <Form groups={data.groups} />
    </div>
  )
}


export default EmailSettings
