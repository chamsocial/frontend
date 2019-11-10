import React, { useState } from 'react'
import PropTypes from 'prop-types'
import SelectUsers from './SelectUsers'

function Form({ subject, users }) {
  const [state, setState] = useState({ subject, message: '' })
  const [recipients, setRecipients] = useState(users)

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
    <form>
      <div className="form-group">
        <label htmlFor="subject">Subject</label>
        <input id="subject" className="input" value={state.subject} onChange={onChange} />
      </div>
      <div className="form-group">
        <label htmlFor="recipients">Recipients</label>
        <SelectUsers users={recipients} setUser={setUser} removeUser={removeUser} />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" className="input" value={state.message} onChange={onChange} />
      </div>
      <div className="form-group">
        <button type="submit">Send</button>
      </div>
    </form>
  )
}
Form.defaultProps = {
  subject: '',
  users: [],
}
Form.propTypes = {
  subject: PropTypes.string,
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
  })),
}

export default Form
