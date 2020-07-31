import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import Loading from 'components/partials/Loading'
import SelectUsers from './SelectUsers'


const NEW_PM = gql`
  mutation postMessageMutation($users: [ID!]!, $subject: String, $message: String!) {
    message(users: $users, subject: $subject, message: $message) {
      id
    }
  }
`


function Form({ toUser }) {
  const [state, setState] = useState({ subject: '', message: '' })
  const [recipients, setRecipients] = useState(toUser ? [toUser] : [])

  const [sendMessage, { loading, error, data }] = useMutation(NEW_PM)
  if (loading) return <Loading />
  if (data && data.message) return <Redirect to={`/messages/${data.message.id}`} />

  const valid = state.subject.length > 2 && state.message.length > 2 && recipients.length > 0

  function onSubmit(evt) {
    evt.preventDefault()
    if (!valid) return
    const users = recipients.map(u => u.id)
    sendMessage({
      variables: { users, subject: state.subject, message: state.message },
    })
  }
  const onChange = evt => {
    const { id, value } = evt.target
    setState(prevState => ({ ...prevState, [id]: value }))
  }
  function setUser(user) {
    if (!user) return
    setRecipients(prevUsers => [user, ...prevUsers])
  }
  function removeUser(id) {
    const recipientsUsers = recipients.filter(u => u.id !== id)
    setRecipients(recipientsUsers)
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="subject">Subject</label>
        <input id="subject" className="input" value={state.subject} onChange={onChange} />
      </div>
      <div className="form-group">
        <SelectUsers users={recipients} setUser={setUser} removeUser={removeUser} />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" className="input" value={state.message} onChange={onChange} />
      </div>
      {error && (
        <div className="alert alert--danger">
          Faild to send. Make sure you have a subject, recipient and message
        </div>
      )}
      <div className="form-group">
        <button type="submit" disabled={!valid} className="btn">Send message</button>
      </div>
    </form>
  )
}


export default Form
