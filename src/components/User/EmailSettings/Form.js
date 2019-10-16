import React from 'react'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'


const SAVE_EMAIL_SETTINGS = gql`mutation userEmailSubscriptionsMutation( $settings: [EmailSubscriptionInput!]! ) {
  updateEmailSubscriptions(settings: $settings)
}`


function Form({ groups }) {
  const [save, { loading, error, data }] = useMutation(SAVE_EMAIL_SETTINGS)
  const [state, setState] = React.useState(() => {
    const initialState = {}
    groups.forEach(group => { initialState[group.id] = group.subscription })
    return initialState
  })

  function onChange(evt) {
    const states = { ...state }
    states[evt.target.name] = evt.target.value
    setState(states)
  }

  function onSubmit(evt) {
    evt.preventDefault()
    if (loading) return
    const settings = Object.keys(state).map(groupId => ({ groupId, type: state[groupId] }))
    save({ variables: { settings } })
  }

  return (
    <form onSubmit={onSubmit}>
      <table className="table table--striped text-center">
        <thead>
          <tr>
            <th className="text-left">Group</th>
            <th>No email</th>
            <th>All direct</th>
            <th>Daily digest</th>
          </tr>
        </thead>
        <tbody>
          {groups.map(group => (
            <tr key={group.id}>
              <th className="text-left">{group.title}</th>
              <td>
                <input type="radio" checked={state[group.id] === 'none'} name={group.id} onChange={onChange} value="none" />
              </td>
              <td>
                <input type="radio" checked={state[group.id] === 'direct'} name={group.id} onChange={onChange} value="direct" />
              </td>
              <td>
                <input type="radio" checked={state[group.id] === 'daily'} name={group.id} onChange={onChange} value="daily" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data && data.updateEmailSubscriptions && <div className="alert alert-success">Settings updated</div>}
      {error && <div className="alert alert-danger">Something went wrong, please try again.</div>}

      <button type="submit" disabled={loading} className="btn">Update email settings</button>
    </form>
  )
}


export default Form
