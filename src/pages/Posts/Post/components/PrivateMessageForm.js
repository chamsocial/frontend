import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import Loading from 'components/partials/Loading'


const POST_PM = gql`
  mutation postMessageMutation($users: [ID!]!, $subject: String, $message: String!) {
    message(users: $users, subject: $subject, message: $message) {
      id
    }
  }
`


function PrivateMessageForm({ post }) {
  const [message, setMessage] = useState('')
  const [sendMessage, { loading, error, data }] = useMutation(POST_PM)
  if (loading || error) return <Loading error={error} />

  if (data && data.message) {
    return (
      <>
        <hr />
        <p>
          The message has been sent to {post.author.username}.
        </p>
        <p>
          <Link to={`/messages/${data.message.id}`}>View message</Link>
        </p>
      </>
    )
  }
  console.log(data, post)

  function onSubmit(evt) {
    evt.preventDefault()
    const subject = `RE: ${post.title}`
    sendMessage({ variables: { users: [post.author.id], subject, message } })
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="message">Private reply to {post.author.username}</label>
        <textarea id="message" className="input" value={message} onChange={evt => setMessage(evt.target.value)} />
      </div>
      <div className="form-group">
        <button type="submit" disabled={message.length < 3} className="btn btn--secondary">Send private message</button>
      </div>
    </form>
  )
}
PrivateMessageForm.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    author: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}


export default PrivateMessageForm
