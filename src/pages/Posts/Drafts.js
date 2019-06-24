import React, { useState } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function deleteOnClick(id, fn) {
  return () => {
    const ok = window.confirm('Are you sure you want to delete the draft?') // eslint-disable-line no-alert
    if (ok) fn(id)
  }
}

const DraftsComponent = props => {
  const [show, setShow] = useState(true)
  const { getDrafts, deleteDraft } = props
  const { loading, error, drafts } = getDrafts
  if (!show || loading || error || (drafts && !drafts.length)) return null

  return (
    <div>
      <strong>Drafts</strong>
      <p className="desc space-between">
        <span>Edit an existing draft or discard drafts</span>
        <button type="button" className="btn btn--small btn--link" onClick={() => setShow(false)}>Hide</button>
      </p>
      <ul className="list">
        {drafts.map(draft => (
          <li key={draft.id} className="space-between">
            <Link to={`/posts/${draft.id}/edit`}>
              {draft.title || 'Unnamed'}
            </Link>
            <button type="button" className="btn btn--link btn--link--desc" onClick={deleteOnClick(draft.id, deleteDraft)}>
              <FontAwesomeIcon icon="trash-alt" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
DraftsComponent.propTypes = {
  getDrafts: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  deleteDraft: PropTypes.func.isRequired,
}

const GET_DRAFTS = gql`
  query getDraftsQuery {
    drafts {
      id
      title
    }
  }
`

const Drafts = graphql(GET_DRAFTS, { name: 'getDrafts' })(DraftsComponent)

export default Drafts
