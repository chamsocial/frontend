import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { useAuthState } from 'components/Auth/context'
import Loading from 'components/partials/Loading'
import { dateToString } from 'utils'


const MESSAGE_THREAD = gql`query messageThreadQuery($threadId: ID!) {
  messageThread(threadId: $threadId) {
    id
    subject
    users {
      id
      username
      slug
    }
    messages {
      id
      message
      createdAt
      user {
        id
        username
      }
    }
  }
}`


function Messages({ match }) {
  const { threadId } = match.params
  const { user } = useAuthState()
  const { loading, error, data } = useQuery(MESSAGE_THREAD, { variables: { threadId } })
  if (loading || error || !data) return <Loading error={error} />
  const thread = data.messageThread

  return (
    <div className="box">
      <Link to="/messages" className="btn float-right">All messages</Link>
      <h1>Private message</h1>
      <h2>{thread.subject}</h2>
      <p>
        Between:{' '}
        {thread.users.map((u, index) => (
          <span key={u.id}>
            <Link to={`/users/${u.slug}`}>{u.username}</Link>
            {thread.users.length !== (index + 1) ? ', ' : ''}
          </span>
        ))}
        {' '}and you
      </p>
      <div>
        {thread.messages.map(message => (
          <div key={message.id} className={`message ${message.user.id === user.id ? 'message--me' : ''}`}>
            <strong>{message.user.username}</strong>
            <div className="message__text">{message.message}</div>
            <small>{dateToString(message.createdAt)}</small>
          </div>
        ))}
      </div>
    </div>
  )
}


export default Messages
