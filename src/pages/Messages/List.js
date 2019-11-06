import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import Loading from 'components/partials/Loading'
import { dateToString } from '../../utils'


const MESSAGES = gql`query messagesListQuery {
  messages {
    id
    subject
    lastMessageAt
    seenAt
    users {
      id
      username
    }
  }
}`


function Messages() {
  const { loading, error, data } = useQuery(MESSAGES)
  if (loading || error) return <Loading error={error} />

  return (
    <div className="box">
      <h1>Private messages</h1>
      <table className="table table--striped">
        <thead>
          <tr>
            <th>Users</th>
            <th>Subject</th>
            <th>Last message</th>
            <th>Seen</th>
          </tr>
        </thead>
        <tbody>
          {data.messages.map(message => (
            <tr key={message.id}>
              <td>{message.users.map(user => user.username).join(', ')}</td>
              <td>
                <Link to={`/messages/${message.id}`}>{message.subject}</Link>
              </td>
              <td>{dateToString(message.lastMessageAt)}</td>
              <td>{message.lastMessageAt < message.seenAt ? '✔︎' : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


export default Messages
