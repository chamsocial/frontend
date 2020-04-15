import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { useAuthState } from 'components/Auth/context'
import Loading from 'components/partials/Loading'
import { dateToString } from 'utils'
import ReplyForm from './ReplyForm'


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
  if (loading || error) return <Loading error={error} />
  if (!data || !data.messageThread) return <h1>No message found!</h1>
  const thread = data.messageThread

  return (
    <div className="layout--narrow">
      <div className="box">
        <div className="space-between">
          <h1>Private message</h1>
          <div>
            <Link to="/messages" className="btn btn--secondary">All messages</Link>
          </div>
        </div>
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
              <div className="message__text">{message.message}</div>
              <div className="message__meta meta space-between">
                <span>{message.user.username}</span>
                <span>{dateToString(message.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>

        <hr />

        <h1>Reply</h1>
        <ReplyForm threadId={threadId} />
      </div>
    </div>
  )
}
Messages.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      threadId: PropTypes.string.isRequired,
    }),
  }).isRequired,
}


export default Messages
