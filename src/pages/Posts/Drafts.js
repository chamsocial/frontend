import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { Link } from 'react-router-dom'

function deleteOnClick(id, fn) {
  return () => fn(id)
}

const DraftsComponent = props => {
  const { getDrafts, deleteDraft } = props
  const { loading, error, drafts } = getDrafts
  if (loading || error || (drafts && !drafts.length)) return null

  return (
    <div>
      <strong>Drafts</strong>
      <div className="desc">Edit an existing draft or discard drafts</div>
      <ul>
        {drafts.map(draft => (
          <li key={draft.id}>
            <Link to={`/posts/${draft.id}/edit`}>
              {draft.title || 'Unnamed'}
            </Link>
            <button type="button" onClick={deleteOnClick(draft.id, deleteDraft)}>
              Delete
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
