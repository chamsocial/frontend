import React from 'react'
import { Link } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
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
  const { loading, error, data } = useQuery(MESSAGES, { fetchPolicy: 'network-only' })
  if (loading || error) return <Loading error={error} />

  return (
    <div className="box">
      <div className="space-between">
        <h1>Private messages</h1>
        <span>
          <Link to="/messages/new" className="btn btn--secondary">New private message</Link>
        </span>
      </div>
      <table className="table table--striped message__list">
        <thead>
          <tr className="text-left">
            <th>Users</th>
            <th>Subject</th>
            <th style={{ minWidth: '160px' }}>Last message</th>
          </tr>
        </thead>
        <tbody>
          {data.messages.map(message => {
            const hasBeenSeen = message.lastMessageAt <= message.seenAt
            return (
              <tr key={message.id} className={`${hasBeenSeen ? '' : 'message__unread'}`}>
                <td>
                  {message.users.map(user => user.username).join(', ')}
                </td>
                <td>
                  <Link to={`/messages/${message.id}`}>{message.subject}</Link>
                </td>
                <td className="meta">{dateToString(message.lastMessageAt)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}


export default Messages
