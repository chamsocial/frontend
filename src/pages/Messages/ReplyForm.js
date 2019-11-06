import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'


const MESSAGE_CREATE = gql`mutation messageCreateMutation($threadId: ID!, $message: String!) {
  messageReply(threadId: $threadId, message: $message) {
    id
    message
    createdAt
    user {
      id
      username
    }
  }
}`


function ReplyForm({ threadId }) {
  const [message, setMessage] = useState('')
  const [reply, { error, loading }] = useMutation(MESSAGE_CREATE)

  function onSubmit(evt) {
    evt.preventDefault()
    reply({ variables: { threadId, message }, refetchQueries: ['messageThreadQuery'] })
      .then(() => setMessage(''))
  }

  return (
    <form onSubmit={onSubmit}>
      {error && <div className="alert alert--danger">Failed to send the reply.</div>}
      <div className="form-group">
        <textarea onChange={evt => setMessage(evt.target.value)} value={message} />
      </div>
      <div className="form-group">
        <button type="submit" disabled={loading} className="btn">Send</button>
      </div>
    </form>
  )
}
ReplyForm.propTypes = {
  threadId: PropTypes.string.isRequired,
}


export default ReplyForm
