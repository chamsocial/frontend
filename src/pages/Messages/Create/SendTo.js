import React from 'react'
import { Link } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import Loading from 'components/partials/Loading'
import Form from './Form'


const userQuery = gql`query userToQuery ($slug: String!) {
  user(slug: $slug) {
    id
    slug
    username
  }
}`


function SendTo({ match }) {
  const { slug } = match.params
  const { loading, error, data } = useQuery(userQuery, { variables: { slug } })
  if (loading || error) return <Loading error={error} />

  if (!data?.user) return <div className="text-center alert alert--danger">No user {slug}</div>

  return (
    <div className="box">
      <div className="space-between">
        <h1>New private message to {data.user.username}</h1>
        <span><Link to="/messages" className="btn">Back</Link></span>
      </div>
      <Form toUser={data.user} />
    </div>
  )
}


export default SendTo
